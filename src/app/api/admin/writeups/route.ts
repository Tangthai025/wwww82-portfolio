import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { WriteUpSchema } from "@/lib/validation";
import { calculateReadingTime } from "@/lib/sanitize";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const writeups = await db.writeUp.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ writeups });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch write-ups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = WriteUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    // Check unique slug
    const existing = await db.writeUp.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "A write-up with this slug already exists" }, { status: 400 });
    }

    const { tags, blocks, content, ...rest } = data;

    // Format content JSON string
    const finalContent =
      typeof content === "string" ? content : JSON.stringify(blocks || []);

    const readingTime = calculateReadingTime(finalContent);

    const writeup = await db.writeUp.create({
      data: {
        ...rest,
        readingTime,
        tags: JSON.stringify(tags || []),
        content: finalContent,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Record revision
    await db.revision.create({
      data: {
        entityType: "WRITEUP",
        entityId: writeup.id,
        title: `Created write-up: ${writeup.title}`,
        contentJson: JSON.stringify(writeup),
      },
    });

    return NextResponse.json({ success: true, writeup });
  } catch (error: any) {
    console.error("Create Write-up Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create write-up" }, { status: 500 });
  }
}
