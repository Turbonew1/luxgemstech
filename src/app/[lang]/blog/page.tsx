import { db } from "@/lib/db";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/ui/Pagination";

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1");
  const limit = 9;

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.article.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Our Blog</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Insights on jewelry craftsmanship, tech trends, and styling tips from
          the LuxGems & Tech team.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No articles published yet.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>

          {/* Manual pagination links (server component) */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <a
                  href={`/blog?page=${page - 1}`}
                  className="inline-flex items-center justify-center h-8 px-3 text-sm rounded-lg border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors"
                >
                  Previous
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <a
                      href={`/blog?page=${p}`}
                      className={`inline-flex items-center justify-center h-8 px-3 text-sm rounded-lg transition-colors ${
                        p === page
                          ? "bg-[#1a1a2e] text-white"
                          : "text-[#1a1a2e] hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </a>
                  </span>
                ))}
              {page < totalPages && (
                <a
                  href={`/blog?page=${page + 1}`}
                  className="inline-flex items-center justify-center h-8 px-3 text-sm rounded-lg border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
