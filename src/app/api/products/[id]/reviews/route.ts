import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await db.review.findMany({
    where: { productId: id },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as unknown as { id: string }).id;

  const body = await request.json();
  const { rating, comment } = body;

  // Validate rating
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be a number between 1 and 5" },
      { status: 400 }
    );
  }

  // Validate comment
  if (comment !== undefined && (typeof comment !== "string" || comment.trim().length === 0)) {
    return NextResponse.json(
      { error: "Comment must be a non-empty string" },
      { status: 400 }
    );
  }

  // Check if product exists
  const product = await db.product.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const review = await db.review.create({
    data: {
      productId: id,
      userId,
      rating,
      comment: comment || "",
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
