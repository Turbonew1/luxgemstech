"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import toast from "react-hot-toast";

export function Footer() {
  const { t, lang } = useTranslations();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Lux<span className="text-[#c9a96e]">Gems</span> & Tech
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.aboutDesc")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/products", label: t("nav.shop") },
                { href: "/blog", label: t("nav.blog") },
                { href: "/products?category=jewelry", label: t("nav.jewelry") },
                { href: "/products?category=electronics", label: t("nav.electronics") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-gray-400 hover:text-[#c9a96e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t("footer.email")}</li>
              <li>{t("footer.phone")}</li>
              <li>Mon - Fri: 9:00 - 18:00 (GMT+8)</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form
              className="flex gap-2"
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#c9a96e] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8934e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LuxGems & Tech. {t("footer.rights")}.</p>
          <div className="mt-2 flex justify-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Shipping Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Returns & Refunds</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
