import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingInfo, currency = "USD", userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; images?: string[] };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < (item.quantity || 1)) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const images: string[] = JSON.parse(product.images || "[]");

      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: product.title,
            images: images.length > 0 ? [images[0]] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity || 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        userId: userId || "guest",
        shippingInfo: JSON.stringify(shippingInfo || {}),
        currency,
        items: JSON.stringify(items.map((i: { productId: string; quantity: number }) => ({
          productId: i.productId,
          quantity: i.quantity || 1,
        }))),
      },
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "JP", "CN",
          "SG", "HK", "KR", "TW",
        ],
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
