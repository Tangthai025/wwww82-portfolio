import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sections = await db.homepageSection.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ sections });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homepage sections" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: "Sections must be an array" }, { status: 400 });
    }

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      await db.homepageSection.upsert({
        where: { sectionKey: s.sectionKey },
        update: {
          title: s.title,
          subtitle: s.subtitle,
          isEnabled: Boolean(s.isEnabled),
          order: i,
          configJson: typeof s.configJson === "string" ? s.configJson : JSON.stringify(s.configJson || {}),
        },
        create: {
          sectionKey: s.sectionKey,
          title: s.title || s.sectionKey,
          subtitle: s.subtitle,
          isEnabled: Boolean(s.isEnabled),
          order: i,
          configJson: typeof s.configJson === "string" ? s.configJson : JSON.stringify(s.configJson || {}),
        },
      });
    }

    const updated = await db.homepageSection.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, sections: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update homepage sections" }, { status: 500 });
  }
}
