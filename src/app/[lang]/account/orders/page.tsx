"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Package, ChevronRight } from "lucide-react";

interface OrderItem {
  id: string;
  product: { title: string; images: string; slug: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

function getStatusVariant(
  status: string
): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "paid":
    case "shipped":
    case "delivered":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOrders(data);
      } catch {
        // Silently fail — orders will be empty
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start shopping to see your orders here
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[#c9a96e] hover:underline font-medium"
              >
                Browse Products
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-[#1a1a2e]">
                          {order.orderNumber}
                        </span>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} -{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-[#1a1a2e]">
                        {formatPrice(order.total, order.currency)}
                      </span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-sm text-[#c9a96e] hover:underline whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="mt-4 flex gap-2">
                    {order.items.slice(0, 4).map((item) => {
                      const images: string[] = JSON.parse(
                        item.product.images || "[]"
                      );
                      return (
                        <div
                          key={item.id}
                          className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0"
                          title={item.product.title}
                        >
                          {images[0] ? (
                            <img
                              src={images[0]}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px]">
                              N/A
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {order.items.length > 4 && (
                      <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
