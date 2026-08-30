"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ExpandableImageProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
}

export function ExpandableImage({
  src,
  alt,
  caption,
  priority = false,
  className = "",
}: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative w-full rounded-cyber overflow-hidden border border-border bg-surface-secondary/40 flex items-center justify-center cursor-zoom-in transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(57,255,136,0.15)] ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        title="คลิกเพื่อดูรูปภาพขนาดเต็มและซูมรายละเอียด"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          unoptimized
          priority={priority}
          className="w-full h-auto max-h-[80vh] object-contain rounded-cyber mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Cyber Hover Overlay & Action Badge */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-cyber bg-[#0a0e14]/90 border border-primary/60 text-primary shadow-xl backdrop-blur transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 text-xs font-mono font-semibold">
            <ZoomIn className="w-4 h-4 text-primary animate-pulse" />
            <span>คลิกเพื่อดูภาพขนาดเต็ม (Zoom / Pan)</span>
            <Maximize2 className="w-3.5 h-3.5 opacity-70 ml-1" />
          </div>
        </div>

        {/* Small corner zoom indicator for mobile / always visible */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-[#0a0e14]/80 border border-border text-[10px] font-mono text-muted flex items-center gap-1 opacity-70 group-hover:opacity-0 transition-opacity">
          <Maximize2 className="w-3 h-3 text-primary" />
          <span>Zoom</span>
        </div>
      </div>

      {caption && (
        <p className="mt-2 text-center text-xs font-mono text-muted">
          {caption}
        </p>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={[{ url: src, alt, caption }]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
