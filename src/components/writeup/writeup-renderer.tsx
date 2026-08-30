"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { CodeBlock } from "./code-block";
import { TerminalBlock } from "./terminal-block";
import { SecurityWarningBlock } from "./security-warning-block";
import { FindingBlock } from "./finding-block";
import { sanitizeContent } from "@/lib/sanitize";
import { TocItem } from "./table-of-contents";
import { ImageLightbox, LightboxImage } from "@/components/ui/image-lightbox";
import { ZoomIn, Maximize2 } from "lucide-react";

export interface BlockData {
  type: string;
  data: Record<string, any>;
}

interface WriteUpRendererProps {
  content: string; // JSON Array string or Markdown
  isMarkdown?: boolean;
  coverImage?: string;
  onExtractToc?: (items: TocItem[]) => void;
}

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

export function WriteUpRenderer({
  content,
  isMarkdown = false,
  coverImage,
  onExtractToc,
}: WriteUpRendererProps) {
  // Parse blocks
  const blocks: BlockData[] = useMemo(() => {
    if (!content) return [];
    if (isMarkdown) {
      // Basic markdown lines parser into structured blocks
      const lines = content.split("\n");
      const parsedBlocks: BlockData[] = [];
      let currentParagraph = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("### ")) {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
          parsedBlocks.push({ type: "heading", data: { level: 3, text: line.replace("### ", "") } });
        } else if (line.startsWith("## ")) {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
          parsedBlocks.push({ type: "heading", data: { level: 2, text: line.replace("## ", "") } });
        } else if (line.startsWith("# ")) {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
          parsedBlocks.push({ type: "heading", data: { level: 1, text: line.replace("# ", "") } });
        } else if (line.startsWith("```")) {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
          const lang = line.replace("```", "").trim() || "bash";
          let codeContent = "";
          i++;
          while (i < lines.length && !lines[i].startsWith("```")) {
            codeContent += lines[i] + "\n";
            i++;
          }
          parsedBlocks.push({ type: "code", data: { language: lang, code: codeContent.trimEnd() } });
        } else if (line.startsWith("> [!WARNING]") || line.startsWith("> ⚠")) {
          parsedBlocks.push({
            type: "warning",
            data: { title: "Security Note", content: lines[i + 1]?.replace(/^>\s*/, "") || "" },
          });
          i++;
        } else if (/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/.test(line.trim())) {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
          const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
          if (imgMatch) {
            parsedBlocks.push({
              type: "image",
              data: {
                alt: imgMatch[1] || "Write-up Image",
                url: imgMatch[2].trim(),
                caption: imgMatch[3] || imgMatch[1] || undefined,
              },
            });
          }
        } else if (line.trim() === "") {
          if (currentParagraph) {
            parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
            currentParagraph = "";
          }
        } else {
          currentParagraph += (currentParagraph ? " " : "") + line;
        }
      }

      if (currentParagraph) {
        parsedBlocks.push({ type: "paragraph", data: { text: currentParagraph.trim() } });
      }

      return parsedBlocks;
    }

    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [{ type: "paragraph", data: { text: content } }];
    }
  }, [content, isMarkdown]);

  // Collect all images in document for lightbox gallery navigation
  const allImages: LightboxImage[] = useMemo(() => {
    const list: LightboxImage[] = [];
    if (coverImage) {
      list.push({ url: coverImage, alt: "Cover Image", caption: "Cover Image" });
    }
    blocks.forEach((block) => {
      if (block.type === "image" && block.data?.url) {
        list.push({
          url: block.data.url,
          alt: block.data.alt || "Write-up Image",
          caption: block.data.caption || block.data.alt,
        });
      }
    });
    return list;
  }, [blocks, coverImage]);

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [customSingleImage, setCustomSingleImage] = useState<LightboxImage | null>(null);

  // Extract TOC items
  React.useEffect(() => {
    if (!onExtractToc) return;
    const toc: TocItem[] = [];
    blocks.forEach((block) => {
      if (block.type === "heading" && block.data?.text) {
        const text = block.data.text;
        const level = Number(block.data.level) || 2;
        const id = slugifyText(text);
        toc.push({ id, text, level });
      }
    });
    onExtractToc(toc);
  }, [blocks, onExtractToc]);

  // Support clicking any inline <img> tags rendered in HTML paragraphs
  const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && !target.closest("button") && !target.closest("[role='button']")) {
      const src = target.getAttribute("src");
      const alt = target.getAttribute("alt") || "";
      if (src) {
        const idx = allImages.findIndex((img) => img.url === src);
        if (idx >= 0) {
          setActiveLightboxIndex(idx);
        } else {
          setCustomSingleImage({ url: src, alt });
        }
      }
    }
  };

  return (
    <>
      <article
        onClick={handleArticleClick}
        className="space-y-6 text-text text-sm sm:text-base leading-relaxed"
      >
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.type) {
          case "heading": {
            const level = Number(block.data?.level) || 2;
            const text = block.data?.text || "";
            const id = slugifyText(text);

            if (level === 1) {
              return (
                <h1
                  key={key}
                  id={id}
                  className="text-2xl sm:text-3xl font-bold text-text font-mono pt-6 pb-2 border-b border-border/80 scroll-mt-24"
                >
                  {text}
                </h1>
              );
            }
            if (level === 2) {
              return (
                <h2
                  key={key}
                  id={id}
                  className="text-xl sm:text-2xl font-semibold text-text font-mono pt-5 pb-1.5 scroll-mt-24 flex items-center gap-2"
                >
                  <span className="text-primary select-none">#</span>
                  <span>{text}</span>
                </h2>
              );
            }
            if (level === 3) {
              return (
                <h3
                  key={key}
                  id={id}
                  className="text-lg sm:text-xl font-medium text-text/90 font-mono pt-4 pb-1 scroll-mt-24 flex items-center gap-2"
                >
                  <span className="text-secondary select-none">##</span>
                  <span>{text}</span>
                </h3>
              );
            }
            return (
              <h4 key={key} id={id} className="text-base font-medium text-text/80 font-mono pt-3 scroll-mt-24">
                {text}
              </h4>
            );
          }

          case "paragraph": {
            const text = block.data?.text || "";
            const safeHtml = sanitizeContent(text);
            return (
              <p
                key={key}
                className="text-text/90 leading-relaxed font-sans text-sm sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            );
          }

          case "code": {
            return (
              <CodeBlock
                key={key}
                code={block.data?.code || ""}
                language={block.data?.language || "bash"}
                filename={block.data?.filename}
              />
            );
          }

          case "terminal": {
            return (
              <TerminalBlock
                key={key}
                title={block.data?.title}
                command={block.data?.command || ""}
                output={block.data?.output}
              />
            );
          }

          case "warning": {
            return (
              <SecurityWarningBlock
                key={key}
                title={block.data?.title}
                content={block.data?.content || ""}
              />
            );
          }

          case "finding": {
            return (
              <FindingBlock
                key={key}
                title={block.data?.title || "Security Finding"}
                severity={block.data?.severity || "HIGH"}
                impact={block.data?.impact || ""}
                recommendation={block.data?.recommendation || ""}
              />
            );
          }

          case "image": {
            const imageUrl = block.data?.url || "/placeholder.jpg";
            const imageAlt = block.data?.alt || "Write-up Image";
            const imageCaption = block.data?.caption;

            return (
              <figure key={key} className="my-6 rounded-cyber overflow-hidden border border-border bg-surface">
                <div
                  onClick={() => {
                    const idx = allImages.findIndex((img) => img.url === imageUrl);
                    setActiveLightboxIndex(idx >= 0 ? idx : 0);
                  }}
                  className="group relative w-full bg-surface-secondary/40 flex items-center justify-center p-1 sm:p-2 cursor-zoom-in transition-all duration-300 hover:border-primary/50"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const idx = allImages.findIndex((img) => img.url === imageUrl);
                      setActiveLightboxIndex(idx >= 0 ? idx : 0);
                    }
                  }}
                  title="คลิกเพื่อดูรูปภาพขนาดเต็มและซูมรายละเอียด"
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={1200}
                    height={800}
                    unoptimized
                    className="w-full h-auto max-h-[80vh] object-contain rounded-cyber mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  />

                  {/* Cyber Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-cyber bg-[#0a0e14]/90 border border-primary/60 text-primary shadow-xl backdrop-blur transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 text-xs font-mono font-semibold">
                      <ZoomIn className="w-4 h-4 text-primary animate-pulse" />
                      <span>คลิกเพื่อดูภาพขนาดเต็ม (Zoom / Pan)</span>
                      <Maximize2 className="w-3.5 h-3.5 opacity-70 ml-1" />
                    </div>
                  </div>

                  {/* Small corner zoom indicator for mobile */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-[#0a0e14]/80 border border-border text-[10px] font-mono text-muted flex items-center gap-1 opacity-70 group-hover:opacity-0 transition-opacity">
                    <Maximize2 className="w-3 h-3 text-primary" />
                    <span>Zoom</span>
                  </div>
                </div>
                {imageCaption && (
                  <figcaption className="p-3 text-center text-xs font-mono text-muted border-t border-border bg-surface-secondary/50">
                    {imageCaption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "table": {
            const rows = block.data?.rows || [];
            const headers = block.data?.headers || [];
            return (
              <div key={key} className="my-6 overflow-x-auto rounded-cyber border border-border">
                <table className="w-full text-left text-xs sm:text-sm font-mono">
                  {headers.length > 0 && (
                    <thead className="bg-surface-secondary border-b border-border text-muted uppercase">
                      <tr>
                        {headers.map((h: string, i: number) => (
                          <th key={i} className="p-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-border/40 bg-surface/50">
                    {rows.map((row: string[], rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-surface-secondary/30 transition-colors">
                        {row.map((cell: string, cIdx: number) => (
                          <td key={cIdx} className="p-3 text-text/90">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "quote": {
            return (
              <blockquote
                key={key}
                className="my-5 border-l-2 border-primary pl-4 py-1 italic text-muted text-sm sm:text-base font-sans"
              >
                &ldquo;{block.data?.text}&rdquo;
                {block.data?.author && (
                  <cite className="block not-italic text-xs font-mono text-primary/80 mt-1">
                    — {block.data.author}
                  </cite>
                )}
              </blockquote>
            );
          }

          case "divider": {
            return <hr key={key} className="my-8 border-border/80" />;
          }

          default:
            return null;
        }
      })}
      </article>

      {/* Fullscreen Cyber Lightbox Modals */}
      {activeLightboxIndex !== null && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          initialIndex={activeLightboxIndex}
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
        />
      )}

      {customSingleImage && (
        <ImageLightbox
          images={[customSingleImage]}
          initialIndex={0}
          isOpen={!!customSingleImage}
          onClose={() => setCustomSingleImage(null)}
        />
      )}
    </>
  );
}
