import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ACCESS_TTL,
  REFRESH_TTL,
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from "@/lib/auth";

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

function clearAndReject() {
  const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  res.cookies.set("accessToken", "", { ...base, path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { ...base, path: "/api/auth", maxAge: 0 });
  return res;
}

export async function POST(req: NextRequest) {
  const raw = req.cookies.get("refreshToken")?.value;
  if (!raw) return clearAndReject();

  const tokenHash = hashToken(raw);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored) return clearAndReject();

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
    return clearAndReject();
  }

  const newRefresh = generateRefreshToken();

  // rotate: delete old, create new, atomically
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { tokenHash } }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newRefresh),
        userId: stored.userId,
        expiresAt: new Date(Date.now() + REFRESH_TTL * 1000),
      },
    }),
  ]);

  const accessToken = await signAccessToken(stored.user.id, stored.user.role);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("accessToken", accessToken, {
    ...base,
    path: "/",
    maxAge: ACCESS_TTL,
  });
  res.cookies.set("refreshToken", newRefresh, {
    ...base,
    path: "/api/auth",
    maxAge: REFRESH_TTL,
  });
  return res;
}