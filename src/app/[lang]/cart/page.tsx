"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "@/hooks/useTranslations";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function CartPage() {
  const { lang } = useParams<{ lang: string }>();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    currency,
  } = useCart();
  const { t } = useTranslations();

  const shipping = 0; // Free shipping
  const total = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">
            {t("cart.title")}
          </h1>
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1a1a2e]">
              {t("cart.empty")}
            </h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link href={`/${lang}/products`} className="mt-6">
              <Button variant="primary">
                {t("cart.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">
            {t("cart.title")} ({cartCount})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            {t("common.delete") || "Delete"} all
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <Link
                      href={`/${lang}/products/${item.slug}`}
                      className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Product details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/${lang}/products/${item.slug}`}
                          className="font-medium text-[#1a1a2e] hover:text-[#c9a96e] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-lg font-bold text-[#1a1a2e]">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 rounded-lg border border-gray-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-[#1a1a2e] disabled:opacity-30 transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                          <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-[#1a1a2e]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-[#1a1a2e] disabled:opacity-30 transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v14m7-7H5"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-[#1a1a2e]">
                  {t("cart.summary")}
                </h2>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{t("cart.subtotal")}</dt>
                    <dd className="font-medium text-[#1a1a2e]">
                      {formatPrice(cartTotal, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{t("cart.shipping")}</dt>
                    <dd className="font-medium text-green-600">
                      {t("cart.free")}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <dt className="text-base font-semibold text-[#1a1a2e]">
                        {t("cart.total")}
                      </dt>
                      <dd className="text-base font-bold text-[#1a1a2e]">
                        {formatPrice(total, currency)}
                      </dd>
                    </div>
                  </div>
                </dl>

                <Link href={`/${lang}/checkout`} className="mt-6 block">
                  <Button variant="secondary" size="lg" className="w-full">
                    {t("cart.checkout")}
                  </Button>
                </Link>

                <Link
                  href={`/${lang}/products`}
                  className="mt-3 block text-center text-sm text-[#c9a96e] hover:text-[#b8934e] transition-colors"
                >
                  {t("cart.continueShopping")} &rarr;
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
