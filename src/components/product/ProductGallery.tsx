"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string | null;
}

export function ProductGallery({ images, videoUrl }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasVideo = !!videoUrl;
  const hasImages = images.length > 0;
  const totalItems = (hasVideo ? 1 : 0) + images.length;
  const hasMultiple = totalItems > 1;

  // activeIndex 0 = video (if present), then images follow
  const isVideoActive = hasVideo && activeIndex === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Main display area */}
      <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
        {isVideoActive ? (
          <video
            src={videoUrl!}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : hasImages ? (
          <img
            src={images[hasVideo ? activeIndex - 1 : activeIndex]}
            alt={`Product image ${activeIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <img
            src="/placeholder.svg"
            alt="No media available"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {/* Video thumbnail (first) */}
          {hasVideo && (
            <button
              onClick={() => setActiveIndex(0)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                isVideoActive
                  ? "border-[#c9a96e] ring-1 ring-[#c9a96e]"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <video
                src={videoUrl!}
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg
                  className="h-6 w-6 text-white drop-shadow-sm"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}

          {/* Image thumbnails */}
          {images.map((image, index) => {
            const imageIndex = hasVideo ? index + 1 : index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(imageIndex)}
                className={cn(
                  "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  {
                    "border-[#c9a96e] ring-1 ring-[#c9a96e]":
                      imageIndex === activeIndex,
                    "border-gray-200 hover:border-gray-300":
                      imageIndex !== activeIndex,
                  }
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
