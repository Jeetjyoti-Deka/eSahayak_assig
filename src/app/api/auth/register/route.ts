import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, createSessionCookie } from "@/lib/auth";
import { z } from "zod";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "User already exists" }, { status: 409 });

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  const token = signToken({ userId: user.id, email: user.email });
  const cookie = createSessionCookie(token);

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
  res.headers.append("Set-Cookie", cookie);
  return res;
}
