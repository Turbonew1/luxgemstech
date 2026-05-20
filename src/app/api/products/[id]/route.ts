import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  const fields = ["title", "slug", "description", "price", "comparePrice", "stock", "sku", "categoryId", "featured", "published", "material", "gemstone", "weight", "specs"];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.images !== undefined) {
    data.images = JSON.stringify(body.images);
  }

  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
