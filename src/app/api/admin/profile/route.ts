import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProfileSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [profile, experiences, skills, tools] = await Promise.all([
      db.profile.findFirst(),
      db.experience.findMany({ orderBy: { order: "asc" } }),
      db.skill.findMany({ orderBy: { order: "asc" } }),
      db.tool.findMany({ orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({ profile, experiences, skills, tools });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile details" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { profile: profileData, experiences, skills, tools } = body;

    // 1. Update Profile
    let updatedProfile = null;
    if (profileData) {
      const parsedProfile = ProfileSchema.safeParse(profileData);
      if (!parsedProfile.success) {
        return NextResponse.json({ error: parsedProfile.error.errors[0]?.message }, { status: 400 });
      }
      updatedProfile = await db.profile.upsert({
        where: { id: "default" },
        update: parsedProfile.data,
        create: { id: "default", ...parsedProfile.data },
      });
    }

    // 2. Update Experiences if provided
    if (Array.isArray(experiences)) {
      await db.experience.deleteMany();
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        await db.experience.create({
          data: {
            role: exp.role || "Security Researcher",
            company: exp.company || "Lab",
            location: exp.location,
            startDate: exp.startDate || "2024",
            endDate: exp.endDate,
            current: Boolean(exp.current),
            description: exp.description || "",
            order: i,
          },
        });
      }
    }

    // 3. Update Skills if provided
    if (Array.isArray(skills)) {
      await db.skill.deleteMany();
      for (let i = 0; i < skills.length; i++) {
        const s = skills[i];
        await db.skill.create({
          data: {
            name: s.name,
            category: s.category || "Security",
            proficiency: Number(s.proficiency) || 80,
            icon: s.icon,
            order: i,
          },
        });
      }
    }

    // 4. Update Tools if provided
    if (Array.isArray(tools)) {
      await db.tool.deleteMany();
      for (let i = 0; i < tools.length; i++) {
        const t = tools[i];
        await db.tool.create({
          data: {
            name: t.name,
            category: t.category || "Penetration Testing",
            description: t.description,
            icon: t.icon,
            order: i,
          },
        });
      }
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
