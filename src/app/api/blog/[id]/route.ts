import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, published } = body;

  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // Check slug uniqueness if changed
  if (slug && slug !== existing.slug) {
    const duplicate = await db.article.findUnique({ where: { slug } });
    if (duplicate) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (content !== undefined) data.content = content;
  if (coverImage !== undefined) data.coverImage = coverImage;
  if (published !== undefined) data.published = published;

  const article = await db.article.update({
    where: { id },
    data,
  });

  return NextResponse.json(article);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  await db.article.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
