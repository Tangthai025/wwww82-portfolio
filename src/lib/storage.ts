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

function getSupabaseStorageConfig() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    (() => {
      const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || "";
      const match = dbUrl.match(/postgres\.([a-z0-9]+):/i);
      return match ? `https://${match[1]}.supabase.co` : null;
    })();

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  return { supabaseUrl, supabaseKey, bucket };
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  const mimeType = file.type;
  const originalName = file.name;
  const size = file.size;

  // Validate MIME type
  const extension = ALLOWED_MIME_TYPES[mimeType];
  if (!extension) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Allowed formats: JPG, PNG, WEBP, AVIF, SVG, PDF.`
    );
  }

  // Validate File Size
  const maxLimit = mimeType === "application/pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
  if (size > maxLimit) {
    throw new Error(
      `File is too large (${(size / 1024 / 1024).toFixed(1)}MB). Max allowed is ${
        maxLimit / 1024 / 1024
      }MB.`
    );
  }

  // Generate safe unique filename
  const randomHash = crypto.randomBytes(16).toString("hex");
  const cleanBaseName = path
    .parse(originalName)
    .name.replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const safeFilename = `${cleanBaseName}_${randomHash}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. Try Supabase Storage if credentials are configured
  const { supabaseUrl, supabaseKey, bucket } = getSupabaseStorageConfig();
  if (supabaseUrl && supabaseKey) {
    try {
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${safeFilename}`;
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": mimeType,
          "x-upsert": "true",
        },
        body: buffer,
      });

      if (res.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${safeFilename}`;
        return {
          filename: safeFilename,
          originalName,
          mimeType,
          size,
          url: publicUrl,
        };
      } else {
        console.warn("Supabase Storage upload returned non-200:", await res.text());
      }
    } catch (supabaseError) {
      console.warn("Supabase Storage upload error:", supabaseError);
    }
  }

  // 2. Try writing to local filesystem (for local dev environments)
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, safeFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    return {
      filename: safeFilename,
      originalName,
      mimeType,
      size,
      url: publicUrl,
    };
  } catch (fsError: any) {
    // 3. Fallback: On serverless environments (e.g. Vercel read-only filesystem EROFS),
    // encode as Base64 Data URL so the upload succeeds cleanly without filesystem write!
    if (fsError.code === "EROFS" || process.env.VERCEL) {
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return {
        filename: safeFilename,
        originalName,
        mimeType,
        size,
        url: dataUrl,
      };
    }

    throw fsError;
  }
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
