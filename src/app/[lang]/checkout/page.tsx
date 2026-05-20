"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "@/hooks/useTranslations";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function CheckoutPage() {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const { items, cartTotal, cartCount, currency, clearCart } = useCart();
  const { t } = useTranslations();
  const [submitting, setSubmitting] = useState(false);

  const shipping = 0;
  const total = cartTotal + shipping;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (items.length === 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingInfo: form,
          currency,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }

      const data = await res.json();

      // If there's a Stripe session URL, redirect
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        clearCart();
        router.push(`/${lang}/account/orders`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "An error occurred during checkout. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e]">
              {t("cart.empty")}
            </h1>
            <p className="mt-2 text-gray-500">
              Add items to your cart before checking out.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">
          {t("checkout.title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Shipping form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-[#1a1a2e]">
                    {t("checkout.shippingInfo")}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="firstName"
                      label={t("checkout.firstName")}
                      value={form.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      required
                    />
                    <Input
                      id="lastName"
                      label={t("checkout.lastName")}
                      value={form.lastName}
                      onChange={(e) =>
                        handleChange("lastName", e.target.value)
                      }
                      required
                    />
                    <Input
                      id="email"
                      type="email"
                      label={t("checkout.email")}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="sm:col-span-2"
                    />
                    <Input
                      id="phone"
                      type="tel"
                      label={t("checkout.phone")}
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="sm:col-span-2"
                    />
                    <Input
                      id="address"
                      label={t("checkout.address")}
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                      className="sm:col-span-2"
                    />
                    <Input
                      id="city"
                      label={t("checkout.city")}
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                    />
                    <Input
                      id="country"
                      label={t("checkout.country")}
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      required
                    />
                    <Input
                      id="zipCode"
                      label={t("checkout.zipCode")}
                      value={form.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order summary */}
            <div>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-[#1a1a2e]">
                    {t("checkout.orderSummary")}
                  </h2>
                </CardHeader>
                <CardContent>
                  {/* Items list */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-gray-50 pb-3"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-[#1a1a2e]">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("cart.quantity")}: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-[#1a1a2e]">
                          {formatPrice(item.price * item.quantity, currency)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
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

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="mt-6 w-full"
                    disabled={submitting}
                  >
                    {submitting
                      ? t("common.loading") || "Processing..."
                      : t("checkout.payNow")}
                  </Button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    Secure payment powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
