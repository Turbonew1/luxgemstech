import { db } from "@/lib/db";
import { formatPrice, cn } from "@/lib/utils";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ReviewForm } from "@/components/product/ReviewForm";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!product) return { title: "Not Found" };
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { lang, slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      published: true,
    },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const images: string[] = JSON.parse(product.images || "[]");
  const specs: Record<string, string> | null = product.specs
    ? JSON.parse(product.specs)
    : null;
  const inStock = product.stock > 0;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  // Import translations for the lang
  const t = (await import(`@/i18n/messages/${lang}.json`)).default as Record<
    string,
    Record<string, string>
  >;

  const breadcrumbItems = [
    { label: t.nav.home || "Home", href: `/${lang}` },
    { label: t.nav.shop || "Shop", href: `/${lang}/products` },
    {
      label: product.category.name,
      href: `/${lang}/products?category=${product.category.slug}`,
    },
    { label: product.title },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Gallery */}
          <ProductGallery images={images} />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-[#c9a96e]">
                {product.category.name}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                {product.title}
              </h1>

              {/* Rating summary */}
              {product.reviews.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={cn("h-4 w-4", {
                          "text-[#c9a96e]": star <= Math.round(avgRating),
                          "text-gray-200": star > Math.round(avgRating),
                        })}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews.length}{" "}
                    {product.reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#1a1a2e]">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.comparePrice, product.currency)}
                    </span>
                  )}
              </div>

              {/* Stock badge */}
              <div className="mt-4">
                <Badge variant={inStock ? "success" : "danger"}>
                  {inStock
                    ? t.product.inStock || "In Stock"
                    : t.product.outOfStock || "Out of Stock"}
                </Badge>
                {inStock && product.stock <= 5 && (
                  <span className="ml-2 text-sm text-yellow-600">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="mt-3 text-sm text-gray-500">
                  {t.product.sku || "SKU"}: {product.sku}
                </p>
              )}

              {/* Attributes for jewelry */}
              <div className="mt-6 space-y-2">
                {product.material && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#1a1a2e]">
                      {t.product.material || "Material"}:
                    </span>
                    <span className="text-gray-600">{product.material}</span>
                  </div>
                )}
                {product.gemstone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#1a1a2e]">Gemstone:</span>
                    <span className="text-gray-600">{product.gemstone}</span>
                  </div>
                )}
                {product.weight != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#1a1a2e]">
                      {t.product.weight || "Weight"}:
                    </span>
                    <span className="text-gray-600">{product.weight}g</span>
                  </div>
                )}
              </div>

              {/* Add to cart + Wishlist */}
              <div className="mt-8 flex flex-col gap-3">
                <AddToCartButton
                  product={{
                    id: product.id,
                    title: product.title,
                    slug: product.slug,
                    price: product.price,
                    currency: product.currency,
                    images,
                    stock: product.stock,
                  }}
                  disabled={!inStock}
                />
                <WishlistButton
                  productId={product.id}
                  productTitle={product.title}
                  variant="button"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">
                {t.product.description || "Description"}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">
                {t.product.reviews || "Reviews"} ({product.reviews.length})
              </h2>
              {product.reviews.length > 0 ? (
                <div className="mt-6 divide-y divide-gray-100">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#1a1a2e]">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={cn("h-3.5 w-3.5", {
                                "text-[#c9a96e]": star <= review.rating,
                                "text-gray-200": star > review.rating,
                              })}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-gray-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  No reviews yet. Be the first to review this product.
                </p>
              )}

              {/* Review Form */}
              <ReviewForm productId={product.id} />
            </div>
          </div>

          {/* Specs sidebar */}
          <div>
            {specs && Object.keys(specs).length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1a1a2e]">
                  {t.product.specifications || "Specifications"}
                </h2>
                <dl className="mt-4 divide-y divide-gray-100">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-2 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="text-sm font-medium text-gray-500">
                        {key}
                      </dt>
                      <dd className="text-sm text-[#1a1a2e] text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
