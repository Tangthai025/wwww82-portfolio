"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, ExternalLink, ShieldCheck, Eye } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export interface CertificationCardProps {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImage?: string | null;
  description?: string | null;
}

export function CertificationCard({
  title,
  issuer,
  issueDate,
  credentialId,
  credentialUrl,
  certificateImage,
  description,
}: CertificationCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="rounded-cyber border border-border bg-surface p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300 group">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="p-2.5 rounded-cyber bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
              Issued {issueDate}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-text font-mono group-hover:text-amber-400 transition-colors">
              {title}
            </h3>
            <div className="text-xs font-mono text-muted mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Issued by {issuer}</span>
            </div>
          </div>

          {description && (
            <p className="text-xs text-muted font-sans line-clamp-3 leading-relaxed pt-1">
              {description}
            </p>
          )}

          {credentialId && (
            <div className="text-[11px] font-mono text-muted/80 bg-surface-secondary/60 px-2.5 py-1 rounded border border-border/40 truncate">
              ID: <span className="text-text">{credentialId}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between gap-2 text-xs font-mono">
          {certificateImage ? (
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1 text-muted hover:text-text transition-colors p-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Badge</span>
            </button>
          ) : (
            <span />
          )}

          {credentialUrl ? (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-cyber bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-medium transition-colors"
            >
              <span>Verify Credential</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[10px] text-muted font-mono">Verified Active</span>
          )}
        </div>
      </div>

      {/* Certificate Image Lightbox Dialog */}
      {certificateImage && (
        <Dialog
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Certificate: ${title}`}
          maxWidth="2xl"
        >
          <div className="relative w-full h-80 sm:h-[450px] bg-black rounded-cyber overflow-hidden">
            <Image
              src={certificateImage}
              alt={title}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-muted">
            <span>Issuer: {issuer}</span>
            <span>ID: {credentialId || "N/A"}</span>
          </div>
        </Dialog>
      )}
    </>
  );
}
