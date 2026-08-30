"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string | null;
  createdAt: string;
}

export function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.media) {
          successCount++;
          setMedia((prev) => [data.media, ...prev]);
        } else {
          error(data.error || `Failed to upload ${file.name}`);
        }
      } catch {
        error(`Network error uploading ${file.name}`);
      }
    }

    if (successCount > 0) {
      success(`Uploaded ${successCount} file(s) successfully!`);
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Media deleted successfully");
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setSelectedMedia(null);
      } else {
        error("Failed to delete media");
      }
    } catch {
      error("Network error deleting media");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success("Media URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = media.filter((item) => {
    const matchSearch =
      !search ||
      item.originalName.toLowerCase().includes(search.toLowerCase()) ||
      item.filename.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "ALL" ||
      (typeFilter === "IMAGE" && item.mimeType.startsWith("image/")) ||
      (typeFilter === "PDF" && item.mimeType === "application/pdf");
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-cyber border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
          isDragging
            ? "border-primary bg-primary/10 shadow-cyber-sm"
            : "border-border bg-surface hover:border-primary/50 hover:bg-surface-secondary"
        }`}
      >
        <div className="p-3 rounded-full bg-surface-secondary border border-border inline-flex text-primary">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-mono text-text">
            {isUploading ? "Uploading files..." : "Drag & Drop media files here or click to browse"}
          </h3>
          <p className="text-xs text-muted font-mono mt-1">
            Supported formats: JPG, PNG, WEBP, AVIF, SVG, PDF (Max: 10MB Images, 20MB PDFs)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1 rounded-cyber text-xs font-mono transition-colors ${
              typeFilter === "ALL"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text border border-border"
            }`}
          >
            All Files ({media.length})
          </button>
          <button
            onClick={() => setTypeFilter("IMAGE")}
            className={`px-3 py-1 rounded-cyber text-xs font-mono transition-colors ${
              typeFilter === "IMAGE"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text border border-border"
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setTypeFilter("PDF")}
            className={`px-3 py-1 rounded-cyber text-xs font-mono transition-colors ${
              typeFilter === "PDF"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text border border-border"
            }`}
          >
            PDF Documents
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface border border-border rounded-cyber text-xs font-mono text-text focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-cyber border border-dashed border-border text-muted text-xs font-mono">
          No media files found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => {
            const isImage = item.mimeType.startsWith("image/");
            const sizeKb = (item.size / 1024).toFixed(0);

            return (
              <div
                key={item.id}
                className="group relative rounded-cyber border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                {/* Preview Thumbnail */}
                <div
                  onClick={() => setSelectedMedia(item)}
                  className="relative w-full h-32 bg-surface-secondary flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {isImage ? (
                    <Image
                      src={item.url}
                      alt={item.originalName}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted">
                      <FileText className="w-8 h-8 text-primary" />
                      <span className="text-[9px] font-mono uppercase">PDF Document</span>
                    </div>
                  )}
                </div>

                {/* Info Bar */}
                <div className="p-2.5 space-y-1 bg-surface">
                  <div className="text-[11px] font-mono text-text truncate" title={item.originalName}>
                    {item.originalName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>{sizeKb} KB</span>
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="text-primary hover:underline flex items-center gap-0.5"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Media Lightbox Modal */}
      {selectedMedia && (
        <Dialog
          isOpen={Boolean(selectedMedia)}
          onClose={() => setSelectedMedia(null)}
          title={`Asset: ${selectedMedia.originalName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 font-mono text-xs">
            {selectedMedia.mimeType.startsWith("image/") ? (
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="group relative w-full h-72 sm:h-96 bg-black rounded-cyber overflow-hidden cursor-zoom-in border border-border/80 hover:border-primary/50 transition-colors"
                title="คลิกเพื่อดูภาพขนาดเต็ม (Zoom / Pan)"
              >
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.originalName}
                  fill
                  unoptimized
                  className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 bg-[#0a0e14]/90 border border-primary/60 text-primary text-xs rounded-cyber font-mono font-semibold shadow-lg">
                    🔍 คลิกเพื่อซูมดูภาพขนาดเต็ม (Inspect / Pan)
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-surface-secondary rounded-cyber border border-border space-y-3">
                <FileText className="w-12 h-12 text-primary mx-auto" />
                <div className="font-bold text-text">{selectedMedia.originalName}</div>
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <span>Open PDF in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="p-3 bg-surface-secondary rounded border border-border/60 space-y-1">
              <div>Path: <span className="text-text">{selectedMedia.url}</span></div>
              <div>MIME: <span className="text-text">{selectedMedia.mimeType}</span></div>
              <div>Size: <span className="text-text">{(selectedMedia.size / 1024).toFixed(1)} KB</span></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(selectedMedia.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete Asset
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(selectedMedia.url, selectedMedia.id)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMedia(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Fullscreen Inspector Lightbox */}
      {selectedMedia && selectedMedia.mimeType.startsWith("image/") && (
        <ImageLightbox
          images={[
            {
              url: selectedMedia.url,
              alt: selectedMedia.originalName,
              caption: `${selectedMedia.originalName} (${(selectedMedia.size / 1024).toFixed(1)} KB)`,
            },
          ]}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
