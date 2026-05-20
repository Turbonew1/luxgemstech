import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product & { category: Category };
}

export function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images || "[]");
  const firstImage = images[0] || "/placeholder.svg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={firstImage}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-[#c9a96e] uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="mt-1 font-semibold text-[#1a1a2e] line-clamp-1">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[#1a1a2e]">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
