import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const publishedOnly = searchParams.get("publishedOnly") === "true";

  const where = publishedOnly ? { published: true } : {};

  const articles = await db.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, published } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  // Check for duplicate slug
  const finalSlug = slug || title.toLowerCase().replace(/[\s]+/g, "-").replace(/[^\w-]/g, "");
  const existing = await db.article.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return NextResponse.json(
      { error: "An article with this slug already exists" },
      { status: 409 }
    );
  }

  const article = await db.article.create({
    data: {
      title,
      slug: finalSlug,
      excerpt: excerpt || "",
      content,
      coverImage: coverImage || null,
      published: published || false,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
