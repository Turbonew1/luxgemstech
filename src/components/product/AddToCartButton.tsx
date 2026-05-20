"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "@/hooks/useTranslations";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    images: string[];
    stock: number;
  };
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { t } = useTranslations();

  function handleAdd() {
    const images: string[] = product.images || [];
    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      currency: product.currency,
      image: images[0] || "/placeholder.svg",
      quantity: 1,
      stock: product.stock,
    });
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full"
      disabled={disabled}
      onClick={handleAdd}
    >
      {t("product.addToCart") || "Add to Cart"}
    </Button>
  );
}
