import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE = "chaoai_session";
const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
};

export async function createSession(userId: string) {
  return new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
}

export async function setSession(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const user = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true, role: true, isBanned: true } });
    return user && !user.isBanned ? user : null;
  } catch {
    return null;
  }
}

export async function requestUser(request: Request) {
  try {
    const token = request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (!token) return null;
    const { payload } = await jwtVerify(decodeURIComponent(token), secret());
    if (!payload.sub) return null;
    const user = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true, role: true, isBanned: true } });
    return user && !user.isBanned ? user : null;
  } catch {
    return null;
  }
}
