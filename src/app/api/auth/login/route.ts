import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";

// In-memory rate limiting map for brute-force protection
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Dummy hash for constant-time comparison against timing attacks
const DUMMY_HASH = "$2a$12$e8Yk1.7Yk1.7Yk1.7Yk1.7uXh7kF2zI0hD2ZpB7uC8m1u6p2e4sWe";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown-ip";
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const now = Date.now();

  // 1. Check Rate Limit / Lockout
  const attemptRecord = loginAttempts.get(clientIp);
  if (attemptRecord && attemptRecord.lockedUntil > now) {
    const remainingSec = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
    const remainingMin = Math.ceil(remainingSec / 60);
    return NextResponse.json(
      {
        error: `Account access locked due to excessive failed attempts. Try again in ${remainingMin} minute(s).`,
        isLocked: true,
        remainingSeconds: remainingSec,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Honeypot Bot Trap Check
    if (body.botField || body.website) {
      // Automated bot detected
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input format" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // 3. Timing-Safe Password Check
    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const isMatch = await comparePassword(password, hashToCompare);

    if (!user || !isMatch) {
      // Record failed attempt
      const currentCount = (attemptRecord && attemptRecord.lockedUntil <= now)
        ? 1
        : (attemptRecord?.count || 0) + 1;

      const lockedUntil = currentCount >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
      loginAttempts.set(clientIp, { count: currentCount, lockedUntil });

      const remainingAttempts = Math.max(0, MAX_ATTEMPTS - currentCount);

      return NextResponse.json(
        {
          error: currentCount >= MAX_ATTEMPTS
            ? `Account locked due to 5 consecutive failed attempts. Please wait 15 minutes.`
            : `Invalid email or security passkey. (${remainingAttempts} attempts remaining)`,
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful authentication
    loginAttempts.delete(clientIp);

    // 4. Create JWT Token Session
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    // 5. Security audit logging
    try {
      await db.revision.create({
        data: {
          entityType: "AUTH",
          entityId: user.id,
          title: `Admin Login (${user.email})`,
          contentJson: JSON.stringify({ ip: clientIp, userAgent: request.headers.get("user-agent") }),
        },
      });
    } catch {
      // Ignore revision log errors
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal authentication subsystem failure" },
      { status: 500 }
    );
  }
}
