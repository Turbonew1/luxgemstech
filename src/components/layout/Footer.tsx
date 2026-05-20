"use client";

import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export function Footer() {
  const { t, lang } = useTranslations();

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
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#c9a96e] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8934e] transition-colors"
              >
                Subscribe
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
