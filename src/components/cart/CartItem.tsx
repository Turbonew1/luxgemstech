"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItemData {
  productId: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  slug: string;
  quantity: number;
  lineTotal: number;
  stock: number;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const image = item.images?.[0];

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product image */}
      <div className="h-24 w-24 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {image ? (
          <img
            src={image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-[#1a1a2e] text-sm leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatPrice(item.price, item.currency)}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="p-2 text-gray-500 hover:text-[#1a1a2e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-[#1a1a2e] min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity + 1)
              }
              disabled={item.quantity >= item.stock}
              className="p-2 text-gray-500 hover:text-[#1a1a2e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="text-sm font-semibold text-[#1a1a2e]">
            {formatPrice(item.lineTotal, item.currency)}
          </span>
        </div>

        {/* Stock warning */}
        {item.quantity >= item.stock && (
          <p className="text-xs text-amber-500 mt-1">Max stock reached</p>
        )}
      </div>
    </div>
  );
}
