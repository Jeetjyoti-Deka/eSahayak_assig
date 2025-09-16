"use server";

import { prisma } from "@/lib/prisma";

export async function checkRateLimit(userId: string) {
  // Check if user has recent requests (e.g., max 10 per minute)
  const windowMs = 60 * 1000; // 1 min
  const limit = 10;
  const windowStart = new Date(Date.now() - windowMs);

  // Cleanup: delete old logs beyond the window
  await prisma.requestLog.deleteMany({
    where: {
      createdAt: { lt: windowStart },
    },
  });

  // Count requests in DB
  const count = await prisma.requestLog.count({
    where: {
      key: userId,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (count >= limit) {
    return { allowed: false };
  }

  // Log this request
  await prisma.requestLog.create({
    data: { key: userId },
  });

  return { allowed: true };
}
