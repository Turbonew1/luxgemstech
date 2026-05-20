"use client";

import { ProductCard } from "./ProductCard";
import type { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

interface ProductGridProps {
  products: ProductWithCategory[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
