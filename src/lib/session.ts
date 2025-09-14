import { prisma } from "@/lib/prisma";
import { parseCookiesFromRequest, verifyToken } from "@/lib/auth";

export async function getCurrentUser(req: Request | undefined) {
  // In server components you can also use cookies() from next/headers,
  // but a generic helper that accepts Request works for API routes & server handlers.
  if (!req) return null;
  const cookies = parseCookiesFromRequest(req);
  const token = cookies[process.env.COOKIE_NAME || "session"];
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.userId) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}
