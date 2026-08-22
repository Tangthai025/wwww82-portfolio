import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/storage";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploaded = await saveUploadedFile(file);

    // Save to Media library table
    const media = await db.media.create({
      data: {
        filename: uploaded.filename,
        originalName: uploaded.originalName,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        url: uploaded.url,
        alt: alt || uploaded.originalName,
      },
    });

    return NextResponse.json({
      success: true,
      media,
      url: uploaded.url,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
