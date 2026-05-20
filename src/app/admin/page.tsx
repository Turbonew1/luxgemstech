import { db } from "@/lib/db";
import Link from "next/link";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, totalRevenue] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({ _sum: { total: true } }),
    ]);

  const recentOrders = await db.order.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    {
      label: "Total Products",
      value: productCount,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: orderCount,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Customers",
      value: userCount,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Revenue",
      value: `$${(totalRevenue._sum.total || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#c9a96e]",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className={`rounded-lg ${stat.bg} p-2`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1a2e]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[#c9a96e] hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#1a1a2e]">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-[#c9a96e]"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.user.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
