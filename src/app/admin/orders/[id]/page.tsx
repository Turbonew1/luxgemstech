import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

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

async function updateOrderStatus(formData: FormData) {
  "use server";

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) return;

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { title: true, images: true, slug: true } },
        },
      },
    },
  });

  if (!order) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">
          Order Not Found
        </h1>
        <Card>
          <CardContent>
            <p className="text-gray-500">This order does not exist.</p>
            <Link
              href="/admin/orders"
              className="mt-4 inline-block text-sm text-[#c9a96e] hover:underline"
            >
              Back to orders
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shippingInfo = JSON.parse(order.shippingInfo || "{}");

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          Order {order.orderNumber}
        </h1>
        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info & Status Update */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">Order Items</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium text-right">Price</th>
                      <th className="pb-3 font-medium text-center">
                        Quantity
                      </th>
                      <th className="pb-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item) => {
                      const images: string[] = JSON.parse(
                        item.product.images || "[]"
                      );
                      return (
                        <tr key={item.id}>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {images[0] ? (
                                  <img
                                    src={images[0]}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                    N/A
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-[#1a1a2e]">
                                {item.product.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-gray-600">
                            {formatPrice(item.price, order.currency)}
                          </td>
                          <td className="py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right font-medium">
                            {formatPrice(
                              item.price * item.quantity,
                              order.currency
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="pt-3 text-right font-medium">
                        Total
                      </td>
                      <td className="pt-3 text-right font-bold text-[#1a1a2e]">
                        {formatPrice(order.total, order.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Customer, Shipping, Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">Customer</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Name: </span>
                  <span className="font-medium">{order.user.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email: </span>
                  <span>{order.user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {shippingInfo && Object.keys(shippingInfo).length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[#1a1a2e]">
                  Shipping Info
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {shippingInfo.name && (
                    <div>
                      <span className="text-gray-500">Name: </span>
                      <span className="font-medium">
                        {shippingInfo.name}
                      </span>
                    </div>
                  )}
                  {shippingInfo.email && (
                    <div>
                      <span className="text-gray-500">Email: </span>
                      <span>{shippingInfo.email}</span>
                    </div>
                  )}
                  {shippingInfo.address && (
                    <div>
                      <span className="text-gray-500">Address: </span>
                      <span>
                        {shippingInfo.address}
                        {shippingInfo.city && `, ${shippingInfo.city}`}
                        {shippingInfo.state && `, ${shippingInfo.state}`}
                        {shippingInfo.zip && ` ${shippingInfo.zip}`}
                        {shippingInfo.country && `, ${shippingInfo.country}`}
                      </span>
                    </div>
                  )}
                  {shippingInfo.phone && (
                    <div>
                      <span className="text-gray-500">Phone: </span>
                      <span>{shippingInfo.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">
                Update Status
              </h2>
            </CardHeader>
            <CardContent>
              <form action={updateOrderStatus} className="space-y-4">
                <input type="hidden" name="orderId" value={order.id} />
                <Select
                  name="status"
                  label="Status"
                  defaultValue={order.status}
                  options={ORDER_STATUSES.map((s) => ({
                    value: s,
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                  }))}
                />
                <Button type="submit" size="sm" className="w-full">
                  Update Status
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">Order Info</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Order Date: </span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Currency: </span>
                  <span>{order.currency}</span>
                </div>
                {order.stripeSessionId && (
                  <div>
                    <span className="text-gray-500">Stripe Session: </span>
                    <span className="font-mono text-xs break-all">
                      {order.stripeSessionId}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
