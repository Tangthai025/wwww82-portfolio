import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
      include: {
        findings: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET Projects Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = ProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await db.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 400 });
    }

    const { findings, tags, tools, technologies, ...rest } = data;

    const project = await db.project.create({
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
        entityId: project.id,
        title: `Created project: ${project.title}`,
        contentJson: JSON.stringify(project),
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
