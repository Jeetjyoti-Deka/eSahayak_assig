import { prisma } from "@/lib/prisma";
import { mapBhkEnumToValue, mapTimelineEnumToValue } from "@/lib/utils";
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
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: id },
      include: {
        history: {
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

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
//     if (!id) {
//       return NextResponse.json(
//         { error: "Buyer ID is required" },
//         { status: 400 }
//       );
//     }

//     // 1. Parse and validate request body
//     const data = await req.json();
//     const parsed = createBuyerSchema.safeParse(data);
//     if (!parsed.success) {
//       return Response.json({ errors: parsed.error.issues }, { status: 400 });
//     }

//     // 2. Update buyer in DB
//     const updatedBuyer = await prisma.buyer.update({
//       where: { id },
//       data: parsed.data,
//     });

//     return NextResponse.json(updatedBuyer, { status: 200 });
//   } catch (error) {
//     console.error("Error updating buyer:", error);
//     return NextResponse.json(
//       { error: "Failed to update buyer" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { error: "Buyer ID is required" },
      { status: 400 }
    );
  }
  // TODO: check if user is authenticated and has access to the buyer

  const data = await req.json();

  // ✅ Validate input server-side
  const parsed = createBuyerSchema.safeParse(data);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.issues }, { status: 400 });
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find dummy user
    const user = await tx.user.findUnique({
      where: {
        email: "test-user@example.com",
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1️⃣ Find original buyer
    const originalBuyer = await tx.buyer.findUnique({
      where: {
        id,
      },
    });

    if (!originalBuyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    // 1️⃣ Update buyer
    const updatedBuyer = await tx.buyer.update({
      where: {
        id,
      },
      data: {
        ...data,
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

    // 3️⃣ Return transformed response
    return Response.json(updatedBuyer, { status: 200 });
  });
}
