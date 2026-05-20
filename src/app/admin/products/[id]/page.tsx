import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany(),
  ]);

  if (!product) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Edit Product</h1>
        <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <a
            href="/admin/products"
            className="text-sm text-[#c9a96e] hover:underline"
          >
            Back to products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Edit Product</h1>
      <div className="max-w-3xl">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
