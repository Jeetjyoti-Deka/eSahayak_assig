import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return Response.json({ userId: null }, { status: 401 });
  return Response.json(
    { userId: user?.id || null, userRole: user.role },
    { status: 200 }
  );
}
