import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Add Product</h1>
      <div className="max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
