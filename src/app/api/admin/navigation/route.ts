import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await db.navigationItem.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch navigation items" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array" }, { status: 400 });
    }

    // Replace all navigation items
    await db.navigationItem.deleteMany();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await db.navigationItem.create({
        data: {
          label: item.label,
          path: item.path,
          isEnabled: item.isEnabled !== undefined ? Boolean(item.isEnabled) : true,
          isExternal: Boolean(item.isExternal),
          order: i,
        },
      });
    }

    const updated = await db.navigationItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, items: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update navigation" }, { status: 500 });
  }
}
