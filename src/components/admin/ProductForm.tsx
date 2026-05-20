"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  videoUrl: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");

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
    videoUrl: "",
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
        videoUrl: (product as Record<string, unknown>).videoUrl as string || "",
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

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Upload failed");
      return null;
    }

    return data.url as string;
  };

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    let hadError = false;

    for (const file of files) {
      const url = await uploadSingleFile(file);
      if (!url) {
        hadError = true;
        continue;
      }

      if (file.type.startsWith("video/")) {
        setForm((prev) => ({ ...prev, videoUrl: url }));
        toast.success("Video uploaded");
      } else {
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    }

    if (!hadError && files.length > 0) {
      toast.success(`Uploaded ${files.length} file${files.length > 1 ? "s" : ""}`);
    }

    setUploading(false);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleUrlAdd = () => {
    const url = urlInputValue.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setUrlInputValue("");
    setShowUrlInput(false);
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
      {/* ===== Basic Info ===== */}
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

      {/* ===== Details ===== */}
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

      {/* ===== Images & Video ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1a1a2e]">Images &amp; Video</h2>

        {/* Video preview */}
        {form.videoUrl && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Product Video
            </p>
            <div className="relative inline-block group">
              <video
                src={form.videoUrl}
                muted
                playsInline
                className="h-24 w-24 rounded-lg object-cover border border-gray-200"
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg pointer-events-none">
                <svg
                  className="h-8 w-8 text-white drop-shadow"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, videoUrl: "" }))
                }
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove video"
              >
                &#215;
              </button>
            </div>
          </div>
        )}

        {/* Image thumbnails */}
        {form.images.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Images ({form.images.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
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
                    title="Remove image"
                  >
                    &#215;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drag-and-drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={[
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
            dragActive
              ? "border-[#c9a96e] bg-[#c9a96e]/5"
              : uploading
                ? "border-blue-300 bg-blue-50 pointer-events-none"
                : "border-gray-300 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="Upload images or video"
          />

          {uploading ? (
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
              <p className="mt-2 text-sm text-gray-500">Uploading…</p>
            </div>
          ) : (
            <div className="text-center">
              {/* Upload icon */}
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-600">
                {dragActive ? "Drop files here" : "Drop images or video here"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                PNG, JPG, GIF, WebP, MP4, WebM, MOV up to 50MB
              </p>
            </div>
          )}
        </div>

        {/* URL paste secondary option */}
        <div className="text-center">
          {showUrlInput ? (
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleUrlAdd}
                className="text-sm font-medium text-[#c9a96e] hover:text-[#b8953e] shrink-0"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInputValue("");
                }}
                className="text-sm text-gray-400 hover:text-gray-600 shrink-0"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-xs text-gray-400 hover:text-[#c9a96e] transition-colors underline underline-offset-2"
            >
              Or paste image URL
            </button>
          )}
        </div>
      </div>

      {/* ===== Settings ===== */}
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

      {/* ===== Submit ===== */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading || uploading}>
          {loading
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
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
