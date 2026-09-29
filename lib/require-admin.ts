import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "ADMIN" ? payload : null;
  } catch {
    return null;
  }
}