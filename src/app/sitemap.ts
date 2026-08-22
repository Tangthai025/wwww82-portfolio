import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wwww82.sec";

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/writeups",
    "/certifications",
    "/resume",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  let writeupRoutes: MetadataRoute.Sitemap = [];

  try {
    const [projects, writeups] = await Promise.all([
      db.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.writeUp.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

    writeupRoutes = writeups.map((w) => ({
      url: `${baseUrl}/writeups/${w.slug}`,
      lastModified: w.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap generation DB error:", error);
  }

  return [...staticRoutes, ...projectRoutes, ...writeupRoutes];
}
