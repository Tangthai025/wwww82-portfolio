import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ThemeSettingSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let theme = await db.themeSetting.findFirst();
    if (!theme) {
      theme = await db.themeSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json({ theme });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appearance settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = ThemeSettingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const updated = await db.themeSetting.upsert({
      where: { id: "default" },
      update: parsed.data,
      create: { id: "default", ...parsed.data },
    });

    // Record revision
    await db.revision.create({
      data: {
        entityType: "APPEARANCE",
        entityId: "default",
        title: `Updated appearance theme: ${updated.preset}`,
        contentJson: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update appearance" }, { status: 500 });
  }
}
