import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { ProductPagination } from "./ProductPagination";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

const PRODUCTS_PER_PAGE = 12;

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { lang } = await params;
  const sp = await searchParams;

  const category = sp.category || "";
  const search = sp.search || "";
  const sort = sp.sort || "newest";
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  const where: Record<string, unknown> = {
    published: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    const cat = await db.category.findUnique({
      where: { slug: category },
      select: { id: true },
    });
    if (cat) {
      where.categoryId = cat.id;
    }
  }

  const orderBy: Record<string, string> =
    sort === "price-low"
      ? { price: "asc" }
      : sort === "price-high"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, totalCount, categories] = await Promise.all([
    db.product.findMany({
      where: where as Parameters<typeof db.product.findMany>[0],
      orderBy,
      include: { category: true },
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    db.product.count({
      where: where as Parameters<typeof db.product.count>[0],
    }),
    db.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const isZh = lang === "zh";

  const t = (await import(`@/i18n/messages/${lang}.json`)).default as Record<
    string,
    Record<string, string>
  >;

  const hasResults = products.length > 0;
  const hasFilters = Boolean(search || category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">
            {search
              ? `${t.product.searchResults || "Search Results"}: "${search}"`
              : category
                ? categories.find((c) => c.slug === category)?.name || category
                : t.product.allProducts || "All Products"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductFilters categories={categories} currentSort={sort} />

        {hasResults ? (
          <>
            <ProductGrid products={products} />
            {totalPages > 1 && (
              <div className="mt-12">
                <ProductPagination
                  page={page}
                  totalPages={totalPages}
                  lang={lang}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e]">
              {t.common.noResults || "No products found"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {hasFilters
                ? "Try adjusting your search or filter criteria."
                : "Check back soon for new arrivals."}
            </p>
            {hasFilters && (
              <Link
                href={`/${lang}/products`}
                className="mt-6 text-sm font-medium text-[#c9a96e] hover:text-[#b8934e]"
              >
                {t.common.back || "Back"} &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
