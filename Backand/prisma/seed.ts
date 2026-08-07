import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "./generated/prisma";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMAGES = {
  cycling1: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
  cycling2: "https://images.unsplash.com/photo-1485965120188-e220f721d03e?w=800&q=80",
  cycling3: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  camping1: "https://images.unsplash.com/photo-1478131337064-12e57a4e5b4b?w=800&q=80",
  camping2: "https://images.unsplash.com/photo-1504280390367-361c58d9b588?w=800&q=80",
  camping3: "https://images.unsplash.com/photo-1523987352904-40be2359980d?w=800&q=80",
  fitness1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  fitness2: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  fitness3: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  water1: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  water2: "https://images.unsplash.com/photo-1502680390469-be75c86b6360?w=800&q=80",
  water3: "https://images.unsplash.com/photo-1527004014047-9a1358f1a6b0?w=800&q=80",
  winter1: "https://images.unsplash.com/photo-1551524164-687aa64d8796?w=800&q=80",
  winter2: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  climbing1: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
  catCycling: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80",
  catCamping: "https://images.unsplash.com/photo-1478131337064-12e57a4e5b4b?w=600&q=80",
  catFitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  catWater: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  catWinter: "https://images.unsplash.com/photo-1551524164-687aa64d8796?w=600&q=80",
  catClimbing: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80",
};

async function clearDemoData() {
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalOrderItem.deleteMany();
  await prisma.rentalOrder.deleteMany();
  await prisma.gearItem.deleteMany();
  await prisma.category.deleteMany();
}

async function main() {
  console.log("🌱 Seeding GearUp with demo data + images...\n");

  await clearDemoData();

  const [adminPass, providerPass, customerPass] = await Promise.all([
    bcrypt.hash("Admin@123", 12),
    bcrypt.hash("Provider@123", 12),
    bcrypt.hash("Customer@123", 12),
  ]);

  await prisma.user.upsert({
    where: { email: "admin@gearup.com" },
    update: { password: adminPass, name: "GearUp Admin", status: "ACTIVE" },
    create: {
      email: "admin@gearup.com",
      password: adminPass,
      name: "GearUp Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const provider1 = await prisma.user.upsert({
    where: { email: "provider@gearup.com" },
    update: {
      password: providerPass,
      name: "Alpine Sports Rental",
      phone: "+1-555-0101",
      address: "123 Mountain View Rd, Denver, CO",
      status: "ACTIVE",
    },
    create: {
      email: "provider@gearup.com",
      password: providerPass,
      name: "Alpine Sports Rental",
      role: "PROVIDER",
      phone: "+1-555-0101",
      address: "123 Mountain View Rd, Denver, CO",
      emailVerified: true,
    },
  });

  const provider2 = await prisma.user.upsert({
    where: { email: "outdoorhub@gearup.com" },
    update: {
      password: providerPass,
      name: "Outdoor Hub Co.",
      phone: "+1-555-0202",
      address: "456 Lake Shore Dr, Austin, TX",
      status: "ACTIVE",
    },
    create: {
      email: "outdoorhub@gearup.com",
      password: providerPass,
      name: "Outdoor Hub Co.",
      role: "PROVIDER",
      phone: "+1-555-0202",
      address: "456 Lake Shore Dr, Austin, TX",
      emailVerified: true,
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "customer@gearup.com" },
    update: { password: customerPass, name: "Sarah Johnson", status: "ACTIVE" },
    create: {
      email: "customer@gearup.com",
      password: customerPass,
      name: "Sarah Johnson",
      role: "CUSTOMER",
      phone: "+1-555-0303",
      emailVerified: true,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "mike.adventures@gearup.com" },
    update: { password: customerPass, name: "Mike Chen", status: "ACTIVE" },
    create: {
      email: "mike.adventures@gearup.com",
      password: customerPass,
      name: "Mike Chen",
      role: "CUSTOMER",
      phone: "+1-555-0404",
      emailVerified: true,
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Cycling", slug: "cycling", description: "Bikes, helmets & cycling gear", imageUrl: IMAGES.catCycling },
    }),
    prisma.category.create({
      data: { name: "Camping", slug: "camping", description: "Tents, sleeping bags & camp gear", imageUrl: IMAGES.catCamping },
    }),
    prisma.category.create({
      data: { name: "Fitness", slug: "fitness", description: "Gym equipment & training gear", imageUrl: IMAGES.catFitness },
    }),
    prisma.category.create({
      data: { name: "Water Sports", slug: "water-sports", description: "Kayaks, SUP boards & snorkel sets", imageUrl: IMAGES.catWater },
    }),
    prisma.category.create({
      data: { name: "Winter Sports", slug: "winter-sports", description: "Skis, snowboards & winter gear", imageUrl: IMAGES.catWinter },
    }),
    prisma.category.create({
      data: { name: "Climbing", slug: "climbing", description: "Harnesses, ropes & climbing kits", imageUrl: IMAGES.catClimbing },
    }),
  ]);

  const [cycling, camping, fitness, water, winter, climbing] = categories;

  const gearItems = await Promise.all([
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: cycling.id,
        name: "TrailMaster X7 Mountain Bike",
        description: "Premium 27.5\" aluminum mountain bike with 21-speed Shimano gears. Perfect for trails and off-road adventures. Helmet available on request.",
        brand: "TrailMaster",
        pricePerDay: 45,
        quantity: 6,
        availableQuantity: 5,
        specifications: { frame: "Aluminum 6061", gears: 21, wheelSize: "27.5\"", suspension: "Front" },
        images: [IMAGES.cycling1, IMAGES.cycling2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: cycling.id,
        name: "SpeedMax Carbon Road Bike",
        description: "Lightweight carbon road bike for long-distance rides and city touring. 18-speed smooth shifting with drop handlebars.",
        brand: "SpeedMax",
        pricePerDay: 55,
        quantity: 4,
        availableQuantity: 4,
        specifications: { frame: "Carbon Fiber", gears: 18, wheelSize: "700c" },
        images: [IMAGES.cycling2, IMAGES.cycling3],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: camping.id,
        name: "OutdoorLife 4-Person Tent",
        description: "Spacious waterproof dome tent with rainfly. 15-minute setup, fits 4 adults. Ideal for family camping weekends.",
        brand: "OutdoorLife",
        pricePerDay: 28,
        quantity: 10,
        availableQuantity: 8,
        specifications: { capacity: 4, weight: "5.2kg", waterproof: "3000mm" },
        images: [IMAGES.camping1, IMAGES.camping2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: camping.id,
        name: "Summit Pro Sleeping Bag (-10°C)",
        description: "Mummy-style sleeping bag rated to -10°C. Compressible and lightweight for cold-weather camping.",
        brand: "Summit Pro",
        pricePerDay: 12,
        quantity: 15,
        availableQuantity: 14,
        specifications: { tempRating: "-10°C", fill: "Synthetic", weight: "1.8kg" },
        images: [IMAGES.camping3],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: winter.id,
        name: "SnowPeak All-Mountain Skis",
        description: "Versatile all-mountain skis with bindings and poles included. For intermediate to advanced skiers.",
        brand: "SnowPeak",
        pricePerDay: 65,
        quantity: 8,
        availableQuantity: 7,
        specifications: { length: "170cm", width: "88mm", includes: "Bindings + Poles" },
        images: [IMAGES.winter1, IMAGES.winter2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: climbing.id,
        name: "RockSafe Climbing Harness Kit",
        description: "Full kit: harness, helmet, belay device, carabiners, and chalk bag. UIAA certified.",
        brand: "RockSafe",
        pricePerDay: 22,
        quantity: 12,
        availableQuantity: 11,
        specifications: { maxWeight: "120kg", certification: "UIAA" },
        images: [IMAGES.climbing1],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "FitPro Adjustable Dumbbell Set",
        description: "Adjustable dumbbells 5kg–25kg per hand with quick-adjust dial. Perfect for home workouts.",
        brand: "FitPro",
        pricePerDay: 18,
        quantity: 8,
        availableQuantity: 7,
        specifications: { minWeight: "5kg", maxWeight: "25kg" },
        images: [IMAGES.fitness1, IMAGES.fitness2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "PowerRack Home Gym Station",
        description: "Power rack with pull-up bar, dip station, and safety bars. Supports squats and bench press.",
        brand: "PowerRack",
        pricePerDay: 35,
        quantity: 3,
        availableQuantity: 3,
        specifications: { maxLoad: "300kg", height: "210cm" },
        images: [IMAGES.fitness3],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: water.id,
        name: "AquaRide 2-Person Inflatable Kayak",
        description: "Stable two-person inflatable kayak. Includes paddles, pump, and repair kit.",
        brand: "AquaRide",
        pricePerDay: 38,
        quantity: 5,
        availableQuantity: 4,
        specifications: { capacity: 2, length: "3.2m", type: "Inflatable" },
        images: [IMAGES.water1, IMAGES.water2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: water.id,
        name: "WaveGlide Stand-Up Paddleboard",
        description: "All-around SUP for beginners and intermediates. Includes paddle, leash, and carry bag.",
        brand: "WaveGlide",
        pricePerDay: 32,
        quantity: 6,
        availableQuantity: 6,
        specifications: { length: "10'6\"", width: "32\"", capacity: "140kg" },
        images: [IMAGES.water3, IMAGES.water1],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: water.id,
        name: "DeepBlue Snorkel & Dive Set",
        description: "Snorkel set with mask, fins, and dry-top snorkel. Multiple sizes available.",
        brand: "DeepBlue",
        pricePerDay: 10,
        quantity: 20,
        availableQuantity: 18,
        specifications: { sizes: ["S", "M", "L", "XL"] },
        images: [IMAGES.water2],
      },
    }),
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: camping.id,
        name: "CampChef Portable Stove Kit",
        description: "Two-burner portable camp stove with cookware set and carrying case.",
        brand: "CampChef",
        pricePerDay: 15,
        quantity: 10,
        availableQuantity: 9,
        specifications: { burners: 2, fuel: "Propane" },
        images: [IMAGES.camping2, IMAGES.camping1],
      },
    }),
  ]);

  const [mountainBike, , tent, , skis, , dumbbells, , kayak, paddleboard] = gearItems;

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  const returnedBike = await prisma.rentalOrder.create({
    data: {
      customerId: customer1.id,
      status: "RETURNED",
      startDate: daysAgo(14),
      endDate: daysAgo(10),
      totalAmount: 180,
      notes: "Weekend trail ride",
      items: { create: { gearItemId: mountainBike.id, quantity: 1, pricePerDay: 45, subtotal: 180 } },
    },
  });

  await prisma.payment.create({
    data: {
      rentalOrderId: returnedBike.id,
      customerId: customer1.id,
      amount: 180,
      method: "STRIPE",
      status: "COMPLETED",
      transactionId: "pi_demo_bike_001",
      paidAt: daysAgo(13),
    },
  });

  await prisma.review.create({
    data: {
      gearItemId: mountainBike.id,
      customerId: customer1.id,
      rentalOrderId: returnedBike.id,
      rating: 5,
      comment: "Amazing bike! Smooth gears and very comfortable for long trail rides. Will rent again!",
    },
  });

  const returnedDumbbells = await prisma.rentalOrder.create({
    data: {
      customerId: customer2.id,
      status: "RETURNED",
      startDate: daysAgo(20),
      endDate: daysAgo(17),
      totalAmount: 54,
      items: { create: { gearItemId: dumbbells.id, quantity: 1, pricePerDay: 18, subtotal: 54 } },
    },
  });

  await prisma.payment.create({
    data: {
      rentalOrderId: returnedDumbbells.id,
      customerId: customer2.id,
      amount: 54,
      method: "SSLCOMMERZ",
      status: "COMPLETED",
      transactionId: "sslc_demo_002",
      paidAt: daysAgo(19),
    },
  });

  await prisma.review.create({
    data: {
      gearItemId: dumbbells.id,
      customerId: customer2.id,
      rentalOrderId: returnedDumbbells.id,
      rating: 4,
      comment: "Great dumbbells, easy to adjust weights. Delivery was smooth.",
    },
  });

  await prisma.rentalOrder.create({
    data: {
      customerId: customer1.id,
      status: "CONFIRMED",
      startDate: daysFromNow(3),
      endDate: daysFromNow(7),
      totalAmount: 112,
      notes: "Family camping trip",
      items: { create: { gearItemId: tent.id, quantity: 1, pricePerDay: 28, subtotal: 112 } },
    },
  });

  await prisma.rentalOrder.create({
    data: {
      customerId: customer2.id,
      status: "PLACED",
      startDate: daysFromNow(5),
      endDate: daysFromNow(8),
      totalAmount: 114,
      items: { create: { gearItemId: kayak.id, quantity: 1, pricePerDay: 38, subtotal: 114 } },
    },
  });

  const paidOrder = await prisma.rentalOrder.create({
    data: {
      customerId: customer2.id,
      status: "PAID",
      startDate: daysFromNow(1),
      endDate: daysFromNow(4),
      totalAmount: 96,
      items: { create: { gearItemId: paddleboard.id, quantity: 1, pricePerDay: 32, subtotal: 96 } },
    },
  });

  await prisma.payment.create({
    data: {
      rentalOrderId: paidOrder.id,
      customerId: customer2.id,
      amount: 96,
      method: "STRIPE",
      status: "COMPLETED",
      transactionId: "pi_demo_sup_003",
      paidAt: daysAgo(1),
    },
  });

  await prisma.rentalOrder.create({
    data: {
      customerId: customer1.id,
      status: "PICKED_UP",
      startDate: daysAgo(2),
      endDate: daysFromNow(2),
      totalAmount: 260,
      notes: "Ski trip to the mountains",
      items: { create: { gearItemId: skis.id, quantity: 1, pricePerDay: 65, subtotal: 260 } },
    },
  });

  console.log("✅ Demo seed completed!\n");
  console.log("📦 Created:");
  console.log("   • 6 categories (with images)");
  console.log("   • 12 gear items (with Unsplash images)");
  console.log("   • 7 rental orders (all statuses)");
  console.log("   • 4 payments + 2 reviews\n");
  console.log("👤 Test Accounts (password for all non-admin: see below):");
  console.log("   Admin:     admin@gearup.com          / Admin@123");
  console.log("   Provider:  provider@gearup.com       / Provider@123");
  console.log("   Provider:  outdoorhub@gearup.com     / Provider@123");
  console.log("   Customer:  customer@gearup.com       / Customer@123");
  console.log("   Customer:  mike.adventures@gearup.com / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
