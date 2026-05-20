import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items } = body;

  if (!items || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Items array is required" },
      { status: 400 }
    );
  }

  const validatedItems = [];

  for (const item of items) {
    if (!item.productId) {
      return NextResponse.json(
        { error: "Each item must have a productId" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        stock: true,
        images: true,
        slug: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found` },
        { status: 404 }
      );
    }

    const quantity = Math.min(item.quantity || 1, product.stock);

    validatedItems.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      stock: product.stock,
      images: JSON.parse(product.images || "[]"),
      slug: product.slug,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = validatedItems.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  return NextResponse.json({
    items: validatedItems,
    subtotal,
    shipping: 0,
    total: subtotal,
  });
}
