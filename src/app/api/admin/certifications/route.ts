import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CertificationSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const certifications = await db.certification.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ certifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = CertificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const cert = await db.certification.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, certification: cert });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create certification" }, { status: 500 });
  }
}
