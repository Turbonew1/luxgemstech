import { NextRequest, NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, country = "US" } = body as {
      items: { productId: string; quantity: number; price: number }[];
      zipCode?: string;
      country?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    const rates = await calculateShipping(items, country);
    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping rates" },
      { status: 500 }
    );
  }
}
