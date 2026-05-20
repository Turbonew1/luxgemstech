"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { useTranslations } from "@/hooks/useTranslations";

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentSort: string;
}

export function ProductFilters({
  categories,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslations();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when changing filters
    params.delete("page");
    const qs = params.toString();
    router.push(`/${lang}/products${qs ? `?${qs}` : ""}`);
  }

  const activeCategory = searchParams.get("category") || "";

  const sortOptions = [
    { value: "newest", label: t("product.newest") || "Newest" },
    {
      value: "price-low",
      label: t("product.priceLow") || "Price: Low to High",
    },
    {
      value: "price-high",
      label: t("product.priceHigh") || "Price: High to Low",
    },
  ];

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Category filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => updateParam("category", "")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-[#1a1a2e] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("product.allProducts") || "All"}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam("category", cat.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-[#1a1a2e] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort select */}
      <div className="w-full sm:w-48">
        <Select
          options={sortOptions}
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
        />
      </div>
    </div>
  );
}
