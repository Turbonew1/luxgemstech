"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "CNY", symbol: "¥", label: "CNY" },
  { code: "JPY", symbol: "¥", label: "JPY" },
];

export function Header() {
  const { t, lang } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("USD");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const otherLang = lang === "zh" ? "en" : "zh";
  const switchLangPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.shop") },
    { href: "/products?category=jewelry", label: t("nav.jewelry") },
    { href: "/products?category=electronics", label: t("nav.electronics") },
    { href: "/blog", label: t("nav.blog") },
  ];

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/${lang}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigateToSearch();
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-[#1a1a2e] text-white text-xs py-1.5 text-center">
        <span className="opacity-80">Free worldwide shipping on orders over $99</span>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-xl font-bold tracking-tight text-[#1a1a2e] shrink-0"
          >
            Lux<span className="text-[#c9a96e]">Gems</span>
            <span className="text-sm font-normal text-gray-400"> & Tech</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${lang}${link.href}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#c9a96e]",
                  pathname === `/${lang}${link.href}`
                    ? "text-[#c9a96e]"
                    : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center">
              {/* Search input with width transition */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t("nav.search")}
                className={cn(
                  "rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9a96e] transition-all duration-300 ease-in-out",
                  searchOpen
                    ? "w-48 opacity-100 ml-0"
                    : "w-0 opacity-0 px-0 border-0 ml-0 overflow-hidden"
                )}
                onBlur={() => {
                  if (!searchQuery) {
                    setSearchOpen(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen && searchQuery) {
                    setSearchQuery("");
                  }
                }}
                className="p-2 text-gray-500 hover:text-[#c9a96e] transition-colors shrink-0"
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="hidden sm:block rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>

            {/* Language switch */}
            <Link
              href={switchLangPath}
              className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-[#c9a96e] transition-colors"
            >
              <Globe className="h-4 w-4" />
              {otherLang === "zh" ? "中文" : "EN"}
            </Link>

            {/* Account */}
            <Link
              href={`/${lang}/auth/login`}
              className="p-2 text-gray-500 hover:text-[#c9a96e] transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href={`/${lang}/cart`}
              className="relative p-2 text-gray-500 hover:text-[#c9a96e] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a96e] text-[10px] font-bold text-white animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 lg:hidden text-gray-500"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${lang}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-[#c9a96e] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-1" />
            <Link
              href={switchLangPath}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-gray-500"
            >
              {otherLang === "zh" ? "切换到中文" : "Switch to English"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
