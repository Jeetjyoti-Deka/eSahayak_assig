// lib/auth.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { serialize, parse } from "cookie";
import bcrypt from "bcryptjs";
import { SigningOptions } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET! as string;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";
const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE || 60 * 60 * 24 * 7); // seconds

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export type JwtPayload = {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">) {
  return jwt.sign(
    payload,
    JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7D",
    } as SignOptions
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function createSessionCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearSessionCookie() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/* Password helpers */
export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/* parse cookies from incoming Request headers */
export function parseCookiesFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  return parse(cookieHeader || "");
}
