import { SignJWT } from "jose";
import { createHash, randomBytes } from "crypto";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export const ACCESS_TTL = 15 * 60; // 15 mins
export const REFRESH_TTL = 7 * 24 * 60 * 60; // 7 days

export function signAccessToken(userId: string, role: string) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL}s`)
    .sign(secret);
}

export const generateRefreshToken = () => randomBytes(48).toString("hex");

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");