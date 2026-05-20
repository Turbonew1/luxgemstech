import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          The article you are looking for does not exist or has not been
          published yet.
        </p>
        <Link
          href="/blog"
          className="text-[#c9a96e] hover:underline font-medium"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: article.title },
        ]}
      />

      {/* Cover Image */}
      {article.coverImage && (
        <div className="rounded-xl overflow-hidden mb-8 aspect-video">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <time dateTime={article.createdAt.toISOString()}>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="text-gray-300">|</span>
          <Badge variant="success">Published</Badge>
        </div>
      </header>

      {/* Excerpt */}
      {article.excerpt && (
        <div className="bg-[#1a1a2e]/5 rounded-xl p-6 mb-8 border-l-4 border-[#c9a96e]">
          <p className="text-lg text-gray-600 italic leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        {article.content.split("\n").map((paragraph, i) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;
          return (
            <p
              key={i}
              className="text-gray-700 leading-relaxed mb-4"
            >
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-100">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#c9a96e] hover:underline font-medium"
        >
          &larr; Back to all articles
        </Link>
      </footer>
    </article>
  );
}
