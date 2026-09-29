import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ACCESS_TTL,
  REFRESH_TTL,
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  // same message for wrong email or wrong password
  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = await signAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL * 1000),
    },
  });

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  });

  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  res.cookies.set("accessToken", accessToken, {
    ...base,
    path: "/",
    maxAge: ACCESS_TTL,
  });

  // only sent to /api/auth/* routes (refresh, logout)
  res.cookies.set("refreshToken", refreshToken, {
    ...base,
    path: "/api/auth",
    maxAge: REFRESH_TTL,
  });

  return res;
}