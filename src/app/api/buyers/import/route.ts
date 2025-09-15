import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createBuyerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  const rows = await req.json();

  if (!Array.isArray(rows)) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  if (rows.length > 200) {
    return Response.json({ error: "Max 200 rows allowed" }, { status: 400 });
  }

  const errors: { row: number; message: string }[] = [];
  const validRows: any[] = [];

  rows.forEach((row, i) => {
    const parsed = createBuyerSchema.safeParse(row);
    if (parsed.success) {
      validRows.push(parsed.data);
    } else {
      errors.push({
        row: i + 1,
        message: parsed.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      });
    }
  });

  // Insert all valid rows in a transaction
  const inserted = await prisma.$transaction(async (tx) => {
    return Promise.all(
      validRows.map(async (buyer) => {
        const newBuyer = await tx.buyer.create({
          data: { ...buyer, ownerId: user.id },
        });
        await tx.buyerHistory.create({
          data: {
            buyerId: newBuyer.id,
            changedBy: user.id,
            changedAt: newBuyer.updatedAt,
            diff: { action: "CREATE", newValues: newBuyer },
          },
        });
        return newBuyer;
      })
    );
  });

  return Response.json(
    { insertedCount: inserted.length, errors },
    { status: 201 }
  );
}
