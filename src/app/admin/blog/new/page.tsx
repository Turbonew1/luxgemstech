"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function NewBlogArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create article");
      }

      toast.success("Article created");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">
        New Blog Article
      </h1>
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#1a1a2e]">Article Details</h2>
            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="my-article-slug"
            />
            <Input
              label="Excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A short summary of the article..."
            />
            <Input
              label="Cover Image URL"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="h-32 w-full rounded-lg object-cover border"
              />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={16}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] font-mono"
                placeholder="Write your article content here..."
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              Published
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Article"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
