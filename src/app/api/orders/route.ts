import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  if (status) where.status = status;

  const orders = await db.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { title: true, images: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, shippingInfo, userId, currency } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Items are required" },
      { status: 400 }
    );
  }

  // Validate products and calculate total
  let total = 0;
  const orderItems: { productId: string; quantity: number; price: number }[] =
    [];

  for (const item of items) {
    if (!item.productId || !item.quantity) {
      return NextResponse.json(
        { error: "Each item must have productId and quantity" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found` },
        { status: 404 }
      );
    }

    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.title}` },
        { status: 400 }
      );
    }

    const linePrice = product.price;
    total += linePrice * item.quantity;
    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: linePrice,
    });
  }

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: userId || "guest",
      status: "pending",
      total,
      currency: currency || "USD",
      shippingInfo: JSON.stringify(shippingInfo || {}),
      items: {
        create: orderItems,
      },
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { title: true, images: true, slug: true } },
        },
      },
    },
  });

  // Reduce stock
  for (const item of orderItems) {
    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return NextResponse.json(order, { status: 201 });
}
