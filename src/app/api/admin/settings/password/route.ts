import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { currentPassword, newPassword, newEmail } = body;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If updating password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }
      const isMatch = await comparePassword(currentPassword, dbUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);
      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          email: newEmail ? newEmail.toLowerCase().trim() : dbUser.email,
        },
      });

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // If only updating email
    if (newEmail) {
      await db.user.update({
        where: { id: user.id },
        data: { email: newEmail.toLowerCase().trim() },
      });
      return NextResponse.json({ success: true, message: "Email updated successfully" });
    }

    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
