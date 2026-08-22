import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

export interface UploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  const mimeType = file.type;
  const originalName = file.name;
  const size = file.size;

  // Validate MIME type
  const extension = ALLOWED_MIME_TYPES[mimeType];
  if (!extension) {
    throw new Error(`Unsupported file type: ${mimeType}. Allowed formats: JPG, PNG, WEBP, AVIF, SVG, PDF.`);
  }

  // Validate File Size
  const maxLimit = mimeType === "application/pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
  if (size > maxLimit) {
    throw new Error(`File is too large (${(size / 1024 / 1024).toFixed(1)}MB). Max allowed is ${maxLimit / 1024 / 1024}MB.`);
  }

  // Generate safe unique filename
  const randomHash = crypto.randomBytes(16).toString("hex");
  const cleanBaseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const safeFilename = `${cleanBaseName}_${randomHash}${extension}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, safeFilename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${safeFilename}`;

  return {
    filename: safeFilename,
    originalName,
    mimeType,
    size,
    url: publicUrl,
  };
}

export async function deleteUploadedFile(filename: string): Promise<boolean> {
  try {
    const safeBase = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeBase);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}
