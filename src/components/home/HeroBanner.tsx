import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#c9a96e] rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl leading-tight">
            Elegance Meets{" "}
            <span className="text-[#c9a96e]">Innovation</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
            Curated jewelry and premium electronics, shipped worldwide. Discover
            craftsmanship that transcends borders.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-lg bg-[#c9a96e] px-8 font-medium text-white hover:bg-[#b8934e] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=jewelry"
              className="inline-flex h-12 items-center rounded-lg border border-white/30 px-8 font-medium text-white hover:bg-white/10 transition-colors"
            >
              Jewelry Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
