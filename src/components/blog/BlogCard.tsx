import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  createdAt: Date | string;
  published: boolean;
}

export function BlogCard({ article }: { article: Article }) {
  const date = new Date(article.createdAt);

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#c9a96e]/30">
        {/* Cover Image */}
        <div className="aspect-video bg-gray-100 overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <time
            dateTime={date.toISOString()}
            className="text-xs text-gray-400 mb-2 block"
          >
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          <h3 className="font-semibold text-[#1a1a2e] mb-2 group-hover:text-[#c9a96e] transition-colors line-clamp-2">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-[#c9a96e] font-medium">
            Read more
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
