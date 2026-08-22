import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await db.project.findUnique({
      where: { id },
      include: {
        findings: { orderBy: { order: "asc" } },
      },
    });

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
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
    const parsed = ProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    // Check slug collision
    const existing = await db.project.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 400 });
    }

    const { findings, tags, tools, technologies, ...rest } = data;

    // Delete existing findings and recreate
    await db.securityFinding.deleteMany({ where: { projectId: id } });

    const updated = await db.project.update({
      where: { id },
      data: {
        ...rest,
        tags: JSON.stringify(tags || []),
        tools: JSON.stringify(tools || []),
        technologies: JSON.stringify(technologies || []),
        findings: {
          create: findings?.map((f, i) => ({
            title: f.title,
            severity: f.severity,
            impact: f.impact,
            recommendation: f.recommendation,
            order: i,
          })),
        },
      },
      include: { findings: true },
    });

    // Record revision
    await db.revision.create({
      data: {
        entityType: "PROJECT",
        entityId: id,
        title: `Updated project: ${updated.title}`,
        contentJson: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error("Update Project Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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
    await db.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
