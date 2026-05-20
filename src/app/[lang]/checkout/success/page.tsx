"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useEffect, useState, use } from "react";

export default function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sp = use(searchParams);
  const p = use(params);
  const lang = p.lang;
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<{
    email?: string;
    amount?: number;
    currency?: string;
    status?: string;
  } | null>(null);

  useEffect(() => {
    async function verifySession() {
      if (!sp.session_id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sp.session_id}`);
        if (res.ok) {
          const data = await res.json();
          setOrderInfo(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, [sp.session_id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-2xl bg-white p-12 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#1a1a2e]">
            {lang === "zh" ? "订单确认" : "Order Confirmed"}
          </h1>
          <p className="mt-2 text-gray-500">
            {lang === "zh"
              ? "感谢您的购买！我们已收到您的订单。"
              : "Thank you for your purchase! Your order has been received."}
          </p>

          {loading && (
            <div className="mt-6">
              <div className="h-4 w-48 mx-auto animate-shimmer rounded bg-neutral-100" />
            </div>
          )}

          {orderInfo && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              {orderInfo.email && (
                <p>
                  {lang === "zh" ? "确认邮件已发送至" : "Confirmation sent to"}{" "}
                  <span className="font-medium text-[#1a1a2e]">{orderInfo.email}</span>
                </p>
              )}
              {orderInfo.amount && (
                <p className="mt-1">
                  {lang === "zh" ? "总金额" : "Total"}:{" "}
                  <span className="font-medium text-[#1a1a2e]">
                    {orderInfo.currency?.toUpperCase() === "CNY" ? "¥" : "$"}
                    {((orderInfo.amount || 0) / 100).toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center justify-center rounded-lg bg-[#c9a96e] px-6 py-3 text-sm font-medium text-white hover:bg-[#b8934e] transition-colors"
            >
              {lang === "zh" ? "继续购物" : "Continue Shopping"}
            </Link>
            <Link
              href={`/${lang}/account/orders`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {lang === "zh" ? "查看订单" : "View Orders"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
