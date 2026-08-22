import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { WriteUpSchema } from "@/lib/validation";
import { calculateReadingTime } from "@/lib/sanitize";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const writeup = await db.writeUp.findUnique({
      where: { id },
    });

    if (!writeup) return NextResponse.json({ error: "Write-up not found" }, { status: 404 });

    return NextResponse.json({ writeup });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch write-up" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const parsed = WriteUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    // Check slug collision
    const existing = await db.writeUp.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json({ error: "A write-up with this slug already exists" }, { status: 400 });
    }

    const { tags, blocks, content, ...rest } = data;

    const finalContent =
      typeof content === "string" ? content : JSON.stringify(blocks || []);
    const readingTime = calculateReadingTime(finalContent);

    const updated = await db.writeUp.update({
      where: { id },
      data: {
        ...rest,
        readingTime,
        tags: JSON.stringify(tags || []),
        content: finalContent,
        publishedAt:
          data.status === "PUBLISHED"
            ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
            : null,
      },
    });

    // Record revision
    await db.revision.create({
      data: {
        entityType: "WRITEUP",
        entityId: id,
        title: `Updated write-up: ${updated.title}`,
        contentJson: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ success: true, writeup: updated });
  } catch (error: any) {
    console.error("Update Write-up Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update write-up" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db.writeUp.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete write-up" }, { status: 500 });
  }
}
