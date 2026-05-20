"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import toast from "react-hot-toast";
import type { Category, Product } from "@prisma/client";

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  stock: number;
  sku: string;
  categoryId: string;
  images: string[];
  featured: boolean;
  published: boolean;
  material: string;
  gemstone: string;
  weight: number;
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductFormData>({
    title: "",
    slug: "",
    description: "",
    price: 0,
    comparePrice: 0,
    stock: 0,
    sku: "",
    categoryId: categories[0]?.id || "",
    images: [],
    featured: false,
    published: false,
    material: "",
    gemstone: "",
    weight: 0,
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || 0,
        stock: product.stock,
        sku: product.sku,
        categoryId: product.categoryId,
        images: JSON.parse(product.images || "[]"),
        featured: product.featured,
        published: product.published,
        material: product.material || "",
        gemstone: product.gemstone || "",
        weight: product.weight || 0,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product
        ? `/api/products/${product.id}`
        : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1a1a2e]">Basic Info</h2>
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
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            label="Compare Price"
            name="comparePrice"
            type="number"
            step="0.01"
            value={form.comparePrice}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
          />
          <Input
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </div>
        <Select
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1a1a2e]">Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Material"
            name="material"
            value={form.material}
            onChange={handleChange}
          />
          <Input
            label="Gemstone"
            name="gemstone"
            value={form.gemstone}
            onChange={handleChange}
          />
          <Input
            label="Weight (g)"
            name="weight"
            type="number"
            step="0.01"
            value={form.weight}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1a1a2e]">Images</h2>
        <div className="flex flex-wrap gap-3">
          {form.images.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt=""
                className="h-24 w-24 rounded-lg object-cover border"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, j) => j !== i),
                  }))
                }
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleImageAdd}
            className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1a1a2e]">Settings</h2>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            Featured product
          </label>
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
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
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
  );
}
