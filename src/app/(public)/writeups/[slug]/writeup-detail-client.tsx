"use client";

import React, { useState } from "react";
import { WriteUpRenderer } from "@/components/writeup/writeup-renderer";
import { TableOfContents, TocItem } from "@/components/writeup/table-of-contents";

interface WriteUpDetailClientProps {
  content: string;
  isMarkdown?: boolean;
  coverImage?: string;
}

export function WriteUpDetailClient({ content, isMarkdown, coverImage }: WriteUpDetailClientProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Main Article Body */}
      <div className="lg:col-span-8 space-y-6">
        <TableOfContents items={tocItems} />
        <WriteUpRenderer
          content={content}
          isMarkdown={isMarkdown}
          coverImage={coverImage}
          onExtractToc={setTocItems}
        />
      </div>

      {/* Sticky Table of Contents (Desktop sidebar) */}
      <div className="hidden lg:block lg:col-span-4">
        <TableOfContents items={tocItems} />
      </div>
    </div>
  );
}
