"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Award, ExternalLink, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface CertItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImage?: string | null;
  description?: string | null;
  order: number;
}

export function CertificationsClient({
  initialCertifications,
}: {
  initialCertifications: CertItem[];
}) {
  const [certs, setCerts] = useState<CertItem[]>(initialCertifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  // Form fields
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenCreate = () => {
    setEditingCert(null);
    setTitle("");
    setIssuer("");
    setIssueDate("2026");
    setCredentialId("");
    setCredentialUrl("");
    setCertificateImage("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: CertItem) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate);
    setCredentialId(cert.credentialId || "");
    setCredentialUrl(cert.credentialUrl || "");
    setCertificateImage(cert.certificateImage || "");
    setDescription(cert.description || "");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCertificateImage(data.url);
        success("Certificate badge uploaded!");
      } else {
        error(data.error || "Upload failed");
      }
    } catch {
      error("Network error uploading file");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !issueDate) {
      error("Title, Issuer, and Issue Date are required");
      return;
    }

    setIsSaving(true);
    const payload = {
      title,
      issuer,
      issueDate,
      credentialId: credentialId || null,
      credentialUrl: credentialUrl || null,
      certificateImage: certificateImage || null,
      description: description || null,
      order: editingCert ? editingCert.order : certs.length,
    };

    try {
      const url = editingCert
        ? `/api/admin/certifications/${editingCert.id}`
        : "/api/admin/certifications";
      const method = editingCert ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        success(editingCert ? "Certification updated" : "Certification added");
        setIsModalOpen(false);
        if (editingCert) {
          setCerts((prev) =>
            prev.map((c) => (c.id === editingCert.id ? data.certification : c))
          );
        } else {
          setCerts((prev) => [...prev, data.certification]);
        }
        router.refresh();
      } else {
        error(data.error || "Failed to save certification");
      }
    } catch {
      error("Network error saving certification");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this certification?")) return;

    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        success("Certification deleted");
        setCerts((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        error("Failed to delete certification");
      }
    } catch {
      error("Network error deleting certification");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          Total: {certs.length} certifications
        </span>
        <Button variant="primary" size="sm" onClick={handleOpenCreate} className="font-mono">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Certification
        </Button>
      </div>

      {/* Certs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-cyber border border-border bg-surface flex flex-col justify-between space-y-4 group hover:border-amber-500/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-muted">{c.issueDate}</span>
              </div>

              <h3 className="text-sm font-bold font-mono text-text">{c.title}</h3>
              <div className="text-xs text-muted font-mono">{c.issuer}</div>

              {c.description && (
                <p className="text-xs text-muted line-clamp-2">{c.description}</p>
              )}

              {c.credentialId && (
                <div className="text-[10px] font-mono text-muted/80 truncate">
                  ID: {c.credentialId}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              {c.credentialUrl ? (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded bg-surface-secondary text-muted hover:text-text"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded bg-red-950/40 text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? "Edit Certification" : "Add Certification"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Certification Name *"
            placeholder="e.g. OSCP (Offensive Security Certified Professional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Issuer Organization *"
              placeholder="e.g. OffSec"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              required
            />
            <Input
              label="Issued Year / Date *"
              placeholder="e.g. 2025"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Credential ID"
              placeholder="e.g. OS-101-88492"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
            />
            <Input
              label="Verification URL"
              placeholder="https://..."
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Badge / Certificate Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="/uploads/... or https://..."
                value={certificateImage}
                onChange={(e) => setCertificateImage(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface border border-border rounded-cyber text-xs font-mono text-text"
              />
              <label className="px-3 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text hover:border-amber-500/50 cursor-pointer shrink-0">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Textarea
            label="Description"
            placeholder="Describe what skills this certification evaluates..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="font-mono"
              isLoading={isSaving}
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {editingCert ? "Update Certification" : "Add Certification"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
