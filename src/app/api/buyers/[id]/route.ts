import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// interface Params {
//   params: Promise<{
//     id: string;
//   }>;
// }

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
