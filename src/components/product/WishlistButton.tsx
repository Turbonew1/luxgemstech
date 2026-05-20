"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
  productTitle?: string;
  variant?: "icon" | "button";
  size?: "sm" | "md";
  className?: string;
}

export function WishlistButton({
  productId,
  productTitle,
  variant = "icon",
  size = "md",
  className,
}: WishlistButtonProps) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isWishlisted(productId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(productId);
      toast.success("Added to wishlist");
    }
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          wishlisted
            ? "border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5"
            : "border-gray-200 text-gray-600 hover:border-[#c9a96e] hover:text-[#c9a96e]",
          className
        )}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            wishlisted && "fill-[#c9a96e]"
          )}
        />
        {wishlisted ? "Wishlisted" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "rounded-full p-1.5 transition-colors",
        wishlisted
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(sizeClasses[size], wishlisted && "fill-current")}
      />
    </button>
  );
}
