"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[activeIndex] : "/placeholder.svg";
  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={currentImage}
          alt={`Product image ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                {
                  "border-[#c9a96e] ring-1 ring-[#c9a96e]":
                    index === activeIndex,
                  "border-gray-200 hover:border-gray-300":
                    index !== activeIndex,
                }
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
