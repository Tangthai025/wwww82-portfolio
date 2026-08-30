"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { CodeBlock } from "./code-block";
import { TerminalBlock } from "./terminal-block";
import { SecurityWarningBlock } from "./security-warning-block";
import { FindingBlock } from "./finding-block";
import { sanitizeContent } from "@/lib/sanitize";
import { TocItem } from "./table-of-contents";

export interface BlockData {
  type: string;
  data: Record<string, any>;
}

interface WriteUpRendererProps {
  content: string; // JSON Array string or Markdown
  isMarkdown?: boolean;
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

  return (
    <article className="space-y-6 text-text text-sm sm:text-base leading-relaxed">
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
            return (
              <figure key={key} className="my-6 rounded-cyber overflow-hidden border border-border bg-surface">
                <div className="relative w-full h-64 sm:h-96">
                  <Image
                    src={block.data?.url || "/placeholder.jpg"}
                    alt={block.data?.alt || "Write-up Image"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                {block.data?.caption && (
                  <figcaption className="p-3 text-center text-xs font-mono text-muted border-t border-border bg-surface-secondary/50">
                    {block.data.caption}
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
  );
}
