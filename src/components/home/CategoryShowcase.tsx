import Link from "next/link";
import { Gem, Cpu } from "lucide-react";
import type { Category } from "@prisma/client";

const fallbackIcons: Record<string, React.ReactNode> = {
  jewelry: <Gem className="h-12 w-12 text-[#c9a96e]" />,
  electronics: <Cpu className="h-12 w-12 text-[#c9a96e]" />,
};

export function CategoryShowcase({
  categories,
}: {
  categories: Category[];
}) {
  if (categories.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {["jewelry", "electronics"].map((slug) => (
          <Link
            key={slug}
            href={`/products?category=${slug}`}
            className="group relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-12 shadow-sm hover:shadow-md transition-all"
          >
            <div className="mb-4 rounded-full bg-gray-50 p-6 group-hover:scale-110 transition-transform">
              {fallbackIcons[slug]}
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] capitalize">
              {slug}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Shop the collection →</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          className="group relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-12 shadow-sm hover:shadow-md transition-all"
        >
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="mb-4 h-24 w-24 rounded-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="mb-4 rounded-full bg-gray-50 p-6 group-hover:scale-110 transition-transform">
              <Gem className="h-12 w-12 text-[#c9a96e]" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-[#1a1a2e]">{cat.name}</h3>
          <p className="mt-1 text-sm text-gray-500">Shop the collection →</p>
        </Link>
      ))}
    </div>
  );
}
