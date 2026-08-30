"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";

export interface LightboxImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Sync initialIndex when modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentImage = images[currentIndex] || images[0];

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 0.5);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (images.length > 1) handlePrev();
      } else if (e.key === "ArrowRight") {
        if (images.length > 1) handleNext();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleResetZoom();
      } else if (e.key === "f" || e.key === "F") {
        handleToggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, handlePrev, handleNext, handleZoomIn, handleZoomOut, handleResetZoom, handleToggleFullscreen, onClose]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.5), 4);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan support
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    touchStartRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - touchStartRef.current.x,
      y: e.touches[0].clientY - touchStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Double click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1.2) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  const handleCopyLink = async () => {
    if (!currentImage?.url) return;
    try {
      const fullUrl = currentImage.url.startsWith("http")
        ? currentImage.url
        : `${window.location.origin}${currentImage.url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!currentImage?.url) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = currentImage.alt?.replace(/[^\w-]/g, "_") || "writeup-image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-[#05070a]/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header / Cyber Toolbar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0a0e14]/90 border-b border-border/80 text-text font-mono text-xs z-20">
        {/* Left: Telemetry & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold">
            <span>IMG_INSPECTOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          {images.length > 1 && (
            <span className="text-muted text-xs">
              [{currentIndex + 1} / {images.length}]
            </span>
          )}
          <span className="text-text/80 truncate text-xs hidden sm:inline-block max-w-xs md:max-w-md">
            {currentImage.caption || currentImage.alt || "Security Telemetry Screenshot"}
          </span>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-surface border border-border rounded p-0.5 mr-1 sm:mr-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1.5 hover:bg-surface-secondary text-muted hover:text-text rounded disabled:opacity-30 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-[11px] font-mono text-primary hover:bg-surface-secondary rounded transition-colors"
              title="Reset Zoom (0)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-1.5 hover:bg-surface-secondary text-muted hover:text-text rounded disabled:opacity-30 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {scale !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-surface-secondary text-secondary hover:text-secondary/80 rounded transition-colors"
                title="Reset to 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <button
            onClick={handleCopyLink}
            className="p-1.5 sm:p-2 bg-surface hover:bg-surface-secondary text-muted hover:text-text border border-border rounded transition-colors"
            title={copied ? "Link Copied!" : "Copy image link"}
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 sm:p-2 bg-surface hover:bg-surface-secondary text-muted hover:text-text border border-border rounded transition-colors"
            title="Download image"
          >
            <Download className="w-4 h-4" />
          </button>

          <a
            href={currentImage.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 bg-surface hover:bg-surface-secondary text-muted hover:text-text border border-border rounded transition-colors hidden sm:inline-flex"
            title="Open original in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2 bg-surface hover:bg-surface-secondary text-muted hover:text-text border border-border rounded transition-colors"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition-colors ml-1 sm:ml-2"
            title="Close viewer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-default"
        onWheel={handleWheel}
        onClick={(e) => {
          // Close if clicking outside the image when not zoomed
          if (e.target === e.currentTarget && scale === 1) {
            onClose();
          }
        }}
      >
        {/* Navigation Previous */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#0a0e14]/80 hover:bg-primary/20 text-text/70 hover:text-primary border border-border hover:border-primary/40 transition-all backdrop-blur shadow-lg"
            title="Previous image (←)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Navigation Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#0a0e14]/80 hover:bg-primary/20 text-text/70 hover:text-primary border border-border hover:border-primary/40 transition-all backdrop-blur shadow-lg"
            title="Next image (→)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Zoomed & Draggable Image Canvas */}
        <div
          className={`max-w-full max-h-full transition-transform ease-out ${
            isDragging ? "duration-0" : "duration-150"
          }`}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={currentImage.url}
            alt={currentImage.alt || "Security Analysis Image"}
            draggable={false}
            className="max-w-[92vw] max-h-[82vh] object-contain rounded border border-border/50 shadow-2xl mx-auto pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              if (scale === 1) {
                setScale(1.75);
              }
            }}
          />
        </div>
      </div>

      {/* Bottom Footer Info & Keyboard Hints */}
      <footer className="px-4 py-2.5 bg-[#0a0e14]/90 border-t border-border/80 text-muted font-mono text-[11px] sm:text-xs z-20 flex flex-wrap items-center justify-between gap-3">
        {/* Caption */}
        <div className="flex items-center gap-2 truncate max-w-full sm:max-w-xl">
          {currentImage.caption ? (
            <span className="text-text/90">
              <span className="text-primary font-semibold">CAPTION:</span> {currentImage.caption}
            </span>
          ) : (
            <span className="text-text/70">{currentImage.alt || "High-Resolution Telemetry"}</span>
          )}
        </div>

        {/* Interactive Tips */}
        <div className="hidden md:flex items-center gap-3 text-muted text-[11px]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">Scroll</kbd> ซูมเข้า/ออก
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">Drag</kbd> ลากเพื่อเลื่อนดูภาพ
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">2x Click</kbd> ซูมเร็ว
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">Esc</kbd> ปิด
          </span>
        </div>
      </footer>
    </div>
  );
}
