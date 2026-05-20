import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== "paid") break;

        // Check if order already exists to prevent duplicates
        if (session.metadata?.orderId) {
          const existingOrder = await db.order.findUnique({
            where: { id: session.metadata.orderId },
          });
          if (existingOrder) break;
        }

        const metadata = session.metadata || {};
        const items = JSON.parse(metadata.items || "[]");
        const shippingInfo = JSON.parse(metadata.shippingInfo || "{}");
        const currency = (metadata.currency || "USD").toUpperCase();
        const userId = metadata.userId || "guest";

        // Get shipping from Stripe
        const rawSession = session as unknown as Record<string, unknown>;
        const stripeShipping = rawSession.shipping as Record<string, unknown> | null;
        if (stripeShipping) {
          shippingInfo.name = stripeShipping.name || shippingInfo.name;
          const addr = stripeShipping.address as Record<string, unknown> | undefined;
          if (addr) {
            shippingInfo.address = addr.line1 || shippingInfo.address;
            shippingInfo.city = addr.city || shippingInfo.city;
            shippingInfo.state = addr.state || shippingInfo.state;
            shippingInfo.zip = addr.postal_code || shippingInfo.zip;
            shippingInfo.country = addr.country || shippingInfo.country;
          }
        }

        const customerDetails = rawSession.customer_details as Record<string, unknown> | null;
        if (customerDetails) {
          shippingInfo.email = shippingInfo.email || customerDetails.email;
          shippingInfo.phone = shippingInfo.phone || customerDetails.phone;
        }

        // Calculate total
        let total = session.amount_total ? session.amount_total / 100 : 0;

        // Create order items
        const orderItems: { productId: string; quantity: number; price: number }[] = [];

        for (const item of items) {
          const product = await db.product.findUnique({
            where: { id: item.productId },
          });
          if (product) {
            orderItems.push({
              productId: product.id,
              quantity: item.quantity || 1,
              price: product.price,
            });
          }
        }

        const order = await db.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            status: "paid",
            total,
            currency,
            shippingInfo: JSON.stringify(shippingInfo),
            stripeSessionId: session.id,
            shippingCarrier: metadata.shippingCarrier || null,
            shippingService: metadata.shippingService || null,
            items: {
              create: orderItems,
            },
          },
          include: {
            items: true,
          },
        });

        // Reduce stock
        for (const item of orderItems) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        console.log(`Order created via webhook: ${order.orderNumber}`);
        break;
      }

      case "checkout.session.expired": {
        // Handle expired sessions if needed
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
