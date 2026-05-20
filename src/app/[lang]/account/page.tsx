"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-500 mb-6">
                Manage your orders and account settings
              </p>
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user as { name?: string; email?: string; role?: string };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">My Account</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <h2 className="font-semibold text-[#1a1a2e]">Profile</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[#1a1a2e]">
                    {user.name || "User"}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Role: {user.role || "customer"}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-500 hover:text-red-600"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">Quick Links</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/account/orders">
                  <div className="rounded-lg border border-gray-100 p-4 hover:border-[#c9a96e] transition-colors cursor-pointer group">
                    <Package className="h-8 w-8 text-[#c9a96e] mb-3" />
                    <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#c9a96e] transition-colors">
                      My Orders
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      View your order history and track shipments
                    </p>
                  </div>
                </Link>
                <Link href="/account/addresses">
                  <div className="rounded-lg border border-gray-100 p-4 hover:border-[#c9a96e] transition-colors cursor-pointer group">
                    <MapPin className="h-8 w-8 text-[#c9a96e] mb-3" />
                    <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#c9a96e] transition-colors">
                      Addresses
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your shipping addresses
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[#1a1a2e]">
                Account Settings
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Account settings and profile management will be available in a
                future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
