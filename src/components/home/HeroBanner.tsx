import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-white overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#c9a96e] rounded-full blur-3xl" />
      </div>

      {/* Floating gold decorative circles */}
      <div className="absolute top-[15%] right-[10%] w-24 h-24 rounded-full border-2 border-[#c9a96e]/20 animate-pulse" />
      <div
        className="absolute top-[35%] right-[18%] w-16 h-16 rounded-full border border-[#c9a96e]/30 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-[20%] right-[12%] w-20 h-20 rounded-full border-2 border-[#c9a96e]/25 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-[10%] left-[5%] w-12 h-12 rounded-full border border-[#c9a96e]/20 animate-pulse" />

      {/* Small gold dot accents */}
      <div
        className="absolute top-[28%] left-[15%] w-3 h-3 rounded-full bg-[#c9a96e]/30 animate-pulse"
        style={{ animationDelay: "0.3s" }}
      />
      <div
        className="absolute bottom-[30%] left-[8%] w-4 h-4 rounded-full bg-[#c9a96e]/40 animate-pulse"
        style={{ animationDelay: "0.8s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:py-40">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl leading-tight">
            Elegance Meets{" "}
            <span className="text-[#c9a96e]">Innovation</span>
          </h1>

          {/* Decorative gold divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />
            <div className="h-2 w-2 rounded-full bg-[#c9a96e]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />
          </div>

          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
            Curated jewelry and premium electronics, shipped worldwide. Discover
            craftsmanship that transcends borders.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-lg bg-[#c9a96e] px-8 font-medium text-white hover:bg-[#b8934e] hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=jewelry"
              className="inline-flex h-12 items-center rounded-lg border border-white/30 px-8 font-medium text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Jewelry Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
