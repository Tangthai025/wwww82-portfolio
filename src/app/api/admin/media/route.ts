import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { filename: { contains: search } },
        { alt: { contains: search } },
      ];
    }
    if (type) {
      where.mimeType = { contains: type };
    }

    const media = await db.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
