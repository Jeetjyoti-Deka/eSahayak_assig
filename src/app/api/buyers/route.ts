import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { mapBhkEnumToValue, mapTimelineEnumToValue } from "@/lib/utils";
import { createBuyerSchema } from "@/lib/validations";
import { Prisma, City, PropertyType, Status, Timeline } from "@prisma/client";

export async function POST(req: Request) {
  const data = await req.json();

  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }

  const result = await checkRateLimit(user.id);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests, please try again later." }),
      { status: 429 }
    );
  }

  // ✅ Validate input server-side
  const parsed = createBuyerSchema.safeParse(data);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.issues }, { status: 400 });
  }

  if (!["Apartment", "Villa"].includes(parsed.data.propertyType)) {
    parsed.data.bhk = null;
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Create buyer
    const newBuyer = await tx.buyer.create({
      data: {
        ...parsed.data,
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

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);

  // Extract filters
  const city = searchParams.get("city") || undefined;
  const propertyType = searchParams.get("propertyType") || undefined;
  const status = searchParams.get("status") || undefined;
  const timeline = searchParams.get("timeline") || undefined;
  const search = searchParams.get("search") || undefined;

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const where: Prisma.BuyerWhereInput = {
    ...(city && city !== "undefined" ? { city: city as City } : {}),
    ...(propertyType && propertyType !== "undefined"
      ? { propertyType: propertyType as PropertyType }
      : {}),
    ...(status && status !== "undefined" ? { status: status as Status } : {}),
    ...(timeline && timeline !== "undefined"
      ? { timeline: timeline as Timeline }
      : {}),
    ...(search && search !== "undefined"
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const total = await prisma.buyer.count({ where });

  const buyers = await prisma.buyer.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return Response.json({
    data: buyers,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
