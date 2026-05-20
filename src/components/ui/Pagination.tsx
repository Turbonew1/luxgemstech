"use client";

import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
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
            <Button
              variant={p === page ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          </span>
        ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
