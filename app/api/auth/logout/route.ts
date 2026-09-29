import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const raw = req.cookies.get("refreshToken")?.value;

  if (raw) {
    // deleteMany doesn't throw if the token is already gone
    await prisma.refreshToken.deleteMany({
      where: { tokenHash: hashToken(raw) },
    });
  }

  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
  };

  const res = NextResponse.json({ ok: true });
  res.cookies.set("accessToken", "", { ...base, path: "/" });
  res.cookies.set("refreshToken", "", { ...base, path: "/api/auth" });
  return res;
}