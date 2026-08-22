import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const qLower = query.toLowerCase();

    // 1. Projects
    const projects = await db.project.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      take: 4,
      select: { id: true, title: true, slug: true, category: true },
    });

    // 2. Write-ups
    const writeups = await db.writeUp.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { category: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      take: 4,
      select: { id: true, title: true, slug: true, category: true, readingTime: true },
    });

    // 3. Certifications
    const certs = await db.certification.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { issuer: { contains: query } },
        ],
      },
      take: 3,
      select: { id: true, title: true, issuer: true },
    });

    // 4. Skills
    const skills = await db.skill.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { category: { contains: query } },
        ],
      },
      take: 3,
      select: { id: true, name: true, category: true },
    });

    const results = [
      ...projects.map((p) => ({
        id: `p-${p.id}`,
        title: p.title,
        subtitle: `Project · ${p.category}`,
        category: "project" as const,
        url: `/projects/${p.slug}`,
      })),
      ...writeups.map((w) => ({
        id: `w-${w.id}`,
        title: w.title,
        subtitle: `Write-up · ${w.category} (${w.readingTime})`,
        category: "writeup" as const,
        url: `/writeups/${w.slug}`,
      })),
      ...certs.map((c) => ({
        id: `c-${c.id}`,
        title: c.title,
        subtitle: `Certification · Issued by ${c.issuer}`,
        category: "certification" as const,
        url: `/certifications`,
      })),
      ...skills.map((s) => ({
        id: `s-${s.id}`,
        title: s.name,
        subtitle: `Skill · ${s.category}`,
        category: "skill" as const,
        url: `/resume`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
