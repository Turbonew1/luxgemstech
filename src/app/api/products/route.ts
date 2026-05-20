import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: Record<string, unknown> = { published: true };
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const orderBy: Record<string, string> =
    sort === "price-low"
      ? { price: "asc" }
      : sort === "price-high"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await db.product.create({
    data: {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      price: body.price,
      comparePrice: body.comparePrice,
      stock: body.stock || 0,
      sku: body.sku,
      images: JSON.stringify(body.images || []),
      categoryId: body.categoryId,
      featured: body.featured || false,
      published: body.published || false,
      material: body.material,
      gemstone: body.gemstone,
      weight: body.weight,
      specs: body.specs,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
