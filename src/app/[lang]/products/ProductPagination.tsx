"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  lang: string;
}

export function ProductPagination({
  page,
  totalPages,
  lang,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(`/${lang}/products${qs ? `?${qs}` : ""}`);
  }

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
