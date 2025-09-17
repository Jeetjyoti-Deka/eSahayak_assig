import bcrypt from "bcryptjs";
import {
  PrismaClient,
  Role,
  City,
  PropertyType,
  Purpose,
  Timeline,
  Source,
  Status,
  BHK,
} from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

async function main() {
  console.log("🌱 Starting seed...");

  // --- 1. Hash passwords ---
  const hashedPassword = await hashPassword("123456");

  // --- 2. Create Users ---
  const [user1, user2] = await Promise.all([
    prisma.user.upsert({
      where: { email: "test1@email.com" },
      update: {},
      create: {
        name: "test1",
        email: "test1@email.com",
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "test2@email.com" },
      update: {},
      create: {
        name: "test2",
        email: "test2@email.com",
        password: hashedPassword,
      },
    }),
  ]);

  console.log("✅ Users created/updated");

  // --- 3. Helper to generate random enums ---
  const getRandomEnum = <T extends object>(enumObj: T): T[keyof T] => {
    const values = Object.values(enumObj);
    return values[Math.floor(Math.random() * values.length)];
  };

  // --- 4. Generate Buyers ---
  const buyersData = [];
  for (let i = 0; i < 30; i++) {
    const owner = i < 15 ? user1 : user2;

    const propertyType = getRandomEnum(PropertyType);

    const bhk =
      propertyType === PropertyType.Apartment ||
      propertyType === PropertyType.Villa
        ? getRandomEnum(BHK)
        : null;

    buyersData.push({
      fullName: `Buyer ${i + 1}`,
      email: `buyer${i + 1}@email.com`,
      phone: `98765${String(10000 + i).slice(-5)}`,
      city: getRandomEnum(City),
      propertyType: propertyType,
      bhk: bhk,
      purpose: getRandomEnum(Purpose),
      budgetMin: Math.floor(Math.random() * 20) * 100000 + 500000, // 5L - 25L
      budgetMax: Math.floor(Math.random() * 40) * 100000 + 3000000, // 30L+
      timeline: getRandomEnum(Timeline),
      source: getRandomEnum(Source),
      status: getRandomEnum(Status),
      notes: Math.random() > 0.7 ? "Interested in prime location" : null,
      tags: Math.random() > 0.5 ? ["hot-lead", "priority"] : [],
      ownerId: owner.id,
    });
  }

  const createdBuyers = await prisma.buyer.createMany({ data: buyersData });
  console.log(`✅ ${createdBuyers.count} Buyers created`);

  // --- 5. Fetch back buyers to create history ---
  const buyers = await prisma.buyer.findMany();

  const buyerHistories = buyers.map((buyer) => ({
    buyerId: buyer.id,
    changedBy: buyer.ownerId,
    diff: {
      action: "CREATE",
      newValues: buyer,
    },
  }));

  await prisma.buyerHistory.createMany({
    data: buyerHistories,
  });

  console.log(`✅ ${buyerHistories.length} BuyerHistory entries created`);

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
