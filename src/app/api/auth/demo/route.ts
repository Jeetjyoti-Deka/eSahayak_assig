// app/api/auth/demo/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth"; // adjust if you have a password utility
import { signToken, createSessionCookie } from "@/lib/auth"; // your session utils

export async function GET() {
  try {
    const demoEmail = "demo@email.com";
    const demoPassword = "demo1234"; // or store in .env if needed

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    // Create user if not exists
    if (!user) {
      const hashedPassword = await hashPassword(demoPassword);

      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: "Demo User",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
    }

    // Create session token
    const token = signToken({ userId: user.id, email: user.email });
    const cookie = createSessionCookie(token);

    // Send response with Set-Cookie header
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    res.headers.append("Set-Cookie", cookie);
    return res;
  } catch (error) {
    console.error("GET /api/auth/demo error:", error);
    return NextResponse.json(
      { error: "Something went wrong creating demo user" },
      { status: 500 }
    );
  }
}
