import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteArticle(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  if (!id) return;

  await db.article.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export default async function AdminBlogPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Blog</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#1a1a2e]">
                    {article.title}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={article.published ? "success" : "default"}
                    >
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${article.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={deleteArticle}>
                        <input type="hidden" name="id" value={article.id} />
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <p className="mb-4">No articles yet</p>
                    <Link href="/admin/blog/new">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                        Write your first article
                      </Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
