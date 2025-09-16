import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createBuyerSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await params;

  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: id },
      include: {
        history: {
          include: {
            changedByUser: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            changedAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Buyer ID is required" },
      { status: 400 }
    );
  }
  // TODO: check if user is authenticated and has access to the buyer
  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }

  const data = await req.json();

  const receivedUpdatedAt = new Date(data.updatedAt);

  // ✅ Validate input server-side
  const parsed = createBuyerSchema.safeParse(data);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.issues }, { status: 400 });
  }

  if (!["Apartment", "Villa"].includes(parsed.data.propertyType)) {
    parsed.data.bhk = null;
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find original buyer
    const originalBuyer = await tx.buyer.findUnique({
      where: {
        id,
      },
    });

    if (!originalBuyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    if (originalBuyer.ownerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (originalBuyer.updatedAt.getTime() !== receivedUpdatedAt.getTime()) {
      return NextResponse.json({ error: "stale data" }, { status: 409 });
    }

    // 1️⃣ Update buyer
    const updatedBuyer = await tx.buyer.update({
      where: {
        id,
      },
      data: {
        ...parsed.data,
      },
    });

    // 3. Compute diff
    const diffFields = Object.fromEntries(
      Object.keys(parsed.data)
        .filter(
          (key) =>
            parsed.data[key as keyof typeof parsed.data] !==
            originalBuyer[key as keyof typeof originalBuyer]
        )
        .map((key) => [
          key,
          {
            from: originalBuyer[key as keyof typeof originalBuyer] ?? null,
            to: parsed.data[key as keyof typeof parsed.data],
          },
        ])
    );

    // 4. Save history only if something actually changed
    if (Object.keys(diffFields).length > 0) {
      await tx.buyerHistory.create({
        data: {
          buyerId: updatedBuyer.id,
          changedBy: user.id,
          changedAt: updatedBuyer.updatedAt,
          diff: {
            action: "UPDATE",
            fields: diffFields,
          },
        },
      });
    }

    // 🔑 Fetch updated buyer with history (latest 5)
    const buyerWithHistory = await tx.buyer.findUnique({
      where: { id: updatedBuyer.id },
      include: {
        history: {
          include: {
            changedByUser: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { changedAt: "desc" },
          take: 5,
        },
      },
    });

    // 3️⃣ Return transformed response
    return Response.json(buyerWithHistory, { status: 200 });
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const buyerId = params.id;

    const user = await getCurrentUser(request);
    if (!user) {
      return Response.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if buyer exists
    const buyer = await prisma.buyer.findUnique({
      where: { id: buyerId },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    if (buyer.ownerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete buyer
    await prisma.buyer.delete({
      where: { id: buyerId },
    });

    return NextResponse.json(
      { message: "Buyer deleted successfully", buyer },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /buyers/[id] error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the buyer" },
      { status: 500 }
    );
  }
}
