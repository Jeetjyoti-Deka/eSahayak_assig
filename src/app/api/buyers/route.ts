import { prisma } from "@/lib/prisma";
import { mapBhkEnumToValue, mapTimelineEnumToValue } from "@/lib/utils";
import { createBuyerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const data = await req.json();

  // ✅ Validate input server-side
  const parsed = createBuyerSchema.safeParse(data);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.issues }, { status: 400 });
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find or create a dummy user
    const user = await tx.user.upsert({
      where: {
        email: "test-user@example.com",
      },
      update: {}, // no update needed if exists
      create: {
        email: "test-user@example.com",
        name: "Test User",
        password: "password",
      },
    });

    // 1️⃣ Create buyer
    const newBuyer = await tx.buyer.create({
      data: {
        ...data,
        ownerId: user.id,
      },
    });

    // 2️⃣ Create buyer history (initial state)
    await tx.buyerHistory.create({
      data: {
        buyerId: newBuyer.id,
        changedBy: user.id,
        changedAt: newBuyer.updatedAt,
        diff: {
          action: "CREATE",
          newValues: newBuyer,
        },
      },
    });

    // 3️⃣ Return transformed response
    return Response.json({
      ...newBuyer,
      bhk: mapBhkEnumToValue(newBuyer.bhk),
      timeline: mapTimelineEnumToValue(newBuyer.timeline),
    });
  });
}

export async function GET() {
  const buyers = await prisma.buyer.findMany({
    include: {
      history: true,
    },
  });
  return Response.json(
    buyers.map((buyer) => ({
      ...buyer,
      bhk: mapBhkEnumToValue(buyer.bhk),
      timeline: mapTimelineEnumToValue(buyer.timeline),
    }))
  );
}
