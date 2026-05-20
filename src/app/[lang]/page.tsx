import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TrustBadges } from "@/components/home/TrustBadges";
import { HeroBanner } from "@/components/home/HeroBanner";

export default async function HomePage() {
  // Fetch featured products from DB via server component
  const featuredProducts = await db.product.findMany({
    where: { featured: true, published: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const newArrivals = await db.product.findMany({
    where: { published: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany();

  return (
    <div>
      <HeroBanner />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#1a1a2e]">
            Shop by Category
          </h2>
          <CategoryShowcase categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-[#c9a96e] hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#1a1a2e]">
            New Arrivals
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* CTA */}
      <section className="py-20 bg-[#1a1a2e] text-white text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of satisfied customers worldwide. Free shipping on
            orders over $99.
          </p>
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-lg bg-[#c9a96e] px-8 font-medium text-white hover:bg-[#b8934e] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
