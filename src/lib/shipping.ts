import { db } from "@/lib/db";

export interface ShippingOption {
  id: string;
  carrier: string;
  serviceName: string;
  rate: number;
  estimatedDays: string;
}

export async function calculateShipping(
  items: { productId: string; quantity: number; price: number }[],
  country: string
): Promise<ShippingOption[]> {
  let totalWeight = 0;
  let orderTotal = 0;

  for (const item of items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { weight: true, category: { select: { name: true } } },
    });
    // Default weight: jewelry ~0.1lb, electronics ~1lb, fallback 0.5lb
    const categoryName = product?.category?.name?.toLowerCase() || "";
    const perItemWeight = product?.weight ||
      (categoryName.includes("jewelry") ? 0.1 :
       categoryName.includes("electronic") ? 1.0 : 0.5);
    totalWeight += perItemWeight * item.quantity;
    orderTotal += item.price * item.quantity;
  }

  const isDomestic = country.toUpperCase() === "US";

  const rates = await db.shippingRate.findMany({
    where: {
      isActive: true,
      minWeight: { lte: totalWeight },
      OR: [
        { maxWeight: null },
        { maxWeight: { gte: totalWeight } },
      ],
    },
    orderBy: { baseRate: "asc" },
  });

  const options: ShippingOption[] = rates.map((rate) => {
    let cost = rate.baseRate + rate.perPoundRate * totalWeight;
    if (isDomestic && orderTotal >= 99) {
      cost = 0;
    }
    return {
      id: rate.id,
      carrier: rate.carrier,
      serviceName: rate.serviceName || rate.name,
      rate: Math.round(cost * 100) / 100,
      estimatedDays: rate.estimatedDays || "5-7 business days",
    };
  });

  if (options.length === 0) {
    const isFree = isDomestic && orderTotal >= 99;
    options.push({
      id: "default",
      carrier: "Standard",
      serviceName: "Standard Shipping",
      rate: isFree ? 0 : 9.99,
      estimatedDays: "7-10 business days",
    });
  }

  return options;
}
