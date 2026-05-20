import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product & { category: Category };
}

function getStockStatus(stock: number) {
  if (stock === 0) return { label: "Out of Stock", color: "text-red-500" };
  if (stock <= 5) return { label: "Low Stock", color: "text-amber-500" };
  return { label: "In Stock", color: "text-green-600" };
}

export function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images || "[]");
  const firstImage = images[0] || "/placeholder.svg";
  const hasSale =
    product.comparePrice != null &&
    product.comparePrice > product.price;
  const discountPercent = hasSale
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;
  const stockStatus = getStockStatus(product.stock);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {/* Sale badge */}
      {hasSale && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist heart icon */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton
          productId={product.id}
          productTitle={product.title}
          size="sm"
          className="rounded-full bg-white/80 p-1.5 shadow-sm hover:bg-white"
        />
      </div>

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={firstImage}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
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
          {hasSale && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice!, product.currency)}
            </span>
          )}
        </div>

        {/* Stock status */}
        <p className={`mt-1.5 text-xs font-medium ${stockStatus.color}`}>
          {stockStatus.label}
        </p>
      </div>
    </Link>
  );
}
