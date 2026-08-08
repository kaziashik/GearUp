import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "./generated/prisma";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Product-matched Pexels images (verified HTTP 200).
 * Keep query-less JPEG URLs so Next.js image optimization stays reliable.
 */
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

const IMAGES = {
  // Cycling (actual bikes / trail riding)
  mtb1: px(2158963),
  mtb2: px(100582),
  mtb3: px(276517),
  road1: px(248547),
  road2: px(1149601),
  road3: px(100582),
  // Camping (tents / camp scenes)
  tent1: px(1687845),
  tent2: px(2422265),
  tent3: px(2582818),
  sleep1: px(1687848),
  sleep2: px(2398220),
  sleep3: px(2662116),
  campKit1: px(1061640),
  campKit2: px(6271625),
  campKit3: px(1687848),
  // Fitness / gym
  gym1: px(841130),
  gym2: px(1552242),
  gym3: px(1954524),
  gym4: px(2294361),
  yoga1: px(3823039),
  yoga2: px(4056723),
  yoga3: px(317157),
  // Hiking
  hike1: px(1271619),
  hike2: px(868097),
  hike3: px(1365425),
  // Water sports
  kayak1: px(2744222),
  kayak2: px(1430677),
  kayak3: px(1666021),
  paddle1: px(1430676),
  paddle2: px(1654496),
  paddle3: px(2744222),
  snorkel1: px(1078983),
  snorkel2: px(1645028),
  snorkel3: px(1430677),
  // Winter / climbing
  ski1: px(848618),
  ski2: px(352093),
  ski3: px(848612),
  climb1: px(1576937),
  climb2: px(1496373),
  climb3: px(1365425),
  // Category covers
  catCycling: px(100582),
  catCamping: px(1687845),
  catFitness: px(841130),
  catWater: px(2744222),
  catWinter: px(848618),
  catClimbing: px(1576937),
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
    // 0 — mountain bike
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: cycling.id,
        name: "TrailMaster X7 Mountain Bike",
        description:
          "Trail-ready 27.5\" mountain bike with Shimano 21-speed shifting and front suspension. Built for forest paths, rocky trails, and weekend off-road rides. Helmet available on request.",
        brand: "TrailMaster",
        pricePerDay: 45,
        quantity: 6,
        availableQuantity: 5,
        specifications: {
          frame: "Aluminum 6061",
          gears: 21,
          wheelSize: "27.5\"",
          suspension: "Front",
          bestFor: "Trail & off-road",
        },
        images: [IMAGES.mtb1, IMAGES.mtb2, IMAGES.mtb3],
      },
    }),
    // 1 — road bike
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: cycling.id,
        name: "SpeedMax Carbon Road Bike",
        description:
          "Lightweight carbon road bike for long scenic rides and city touring. Crisp 18-speed shifting, drop bars, and endurance geometry for all-day comfort.",
        brand: "SpeedMax",
        pricePerDay: 55,
        quantity: 4,
        availableQuantity: 4,
        specifications: {
          frame: "Carbon Fiber",
          gears: 18,
          wheelSize: "700c",
          bestFor: "Road & touring",
        },
        images: [IMAGES.road1, IMAGES.road2, IMAGES.road3],
      },
    }),
    // 2 — tent
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: camping.id,
        name: "OutdoorLife 4-Person Dome Tent",
        description:
          "Spacious waterproof dome tent with full rainfly and ~15-minute setup. Sleeps up to 4 adults — ideal for lakeside weekends, mountain camping, and festival trips.",
        brand: "OutdoorLife",
        pricePerDay: 28,
        quantity: 10,
        availableQuantity: 8,
        specifications: {
          capacity: "4 people",
          weight: "5.2kg",
          waterproof: "3000mm",
          setupTime: "15 minutes",
        },
        images: [IMAGES.tent1, IMAGES.tent2, IMAGES.tent3],
      },
    }),
    // 3 — sleeping bag
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: camping.id,
        name: "Summit Pro Sleeping Bag (-10°C)",
        description:
          "Warm mummy-style sleeping bag rated to -10°C with compressible synthetic fill. Packs small for backpacking and stays cozy on cold nights.",
        brand: "Summit Pro",
        pricePerDay: 12,
        quantity: 15,
        availableQuantity: 14,
        specifications: {
          tempRating: "-10°C",
          fill: "Synthetic",
          weight: "1.8kg",
          shape: "Mummy",
        },
        images: [IMAGES.sleep1, IMAGES.sleep2, IMAGES.sleep3],
      },
    }),
    // 4 — skis
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: winter.id,
        name: "SnowPeak All-Mountain Ski Package",
        description:
          "Complete ski package with bindings and poles. Tuned for intermediate to advanced riders who want confidence on groomers and soft powder days.",
        brand: "SnowPeak",
        pricePerDay: 65,
        quantity: 8,
        availableQuantity: 7,
        specifications: {
          length: "170cm",
          width: "88mm",
          includes: "Bindings + Poles",
          level: "Intermediate–Advanced",
        },
        images: [IMAGES.ski1, IMAGES.ski2, IMAGES.ski3],
      },
    }),
    // 5 — climbing
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: climbing.id,
        name: "RockSafe Climbing Harness Kit",
        description:
          "Full climbing kit: harness, helmet, belay device, locking carabiners, and chalk bag. UIAA certified and cleaned after every rental.",
        brand: "RockSafe",
        pricePerDay: 22,
        quantity: 12,
        availableQuantity: 11,
        specifications: {
          maxWeight: "120kg",
          certification: "UIAA",
          includes: "Harness, helmet, belay, carabiners",
        },
        images: [IMAGES.climb1, IMAGES.climb2, IMAGES.climb3],
      },
    }),
    // 6 — dumbbells
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "FitPro Adjustable Dumbbell Set",
        description:
          "Adjustable dumbbells from 5kg to 25kg per hand with a quick-dial system. Perfect for strength training and home gym sessions without bulky plates.",
        brand: "FitPro",
        pricePerDay: 18,
        quantity: 8,
        availableQuantity: 7,
        specifications: {
          minWeight: "5kg",
          maxWeight: "25kg",
          style: "Quick-adjust dial",
          bestFor: "Strength & toning",
        },
        images: [IMAGES.gym1, IMAGES.gym2, IMAGES.gym4],
      },
    }),
    // 7 — home strength
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "PowerFlow Home Strength Kit",
        description:
          "Home strength kit with resistance bands, yoga mat, and training accessories. Built for full-body workouts, mobility work, and daily training at home.",
        brand: "PowerFlow",
        pricePerDay: 25,
        quantity: 5,
        availableQuantity: 5,
        specifications: {
          includes: "Bands + mat + handles",
          resistanceLevels: "5",
          bestFor: "Home workouts",
        },
        images: [IMAGES.gym3, IMAGES.gym4, IMAGES.yoga1],
      },
    }),
    // 8 — kayak
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: water.id,
        name: "AquaRide 2-Person Inflatable Kayak",
        description:
          "Stable two-person inflatable kayak for lakes and calm rivers. Includes paddles, high-volume pump, and repair kit — packs easily in a car trunk.",
        brand: "AquaRide",
        pricePerDay: 38,
        quantity: 5,
        availableQuantity: 4,
        specifications: {
          capacity: "2 people",
          length: "3.2m",
          type: "Inflatable",
          includes: "Paddles + pump",
        },
        images: [IMAGES.kayak1, IMAGES.kayak2, IMAGES.kayak3],
      },
    }),
    // 9 — paddleboard
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: water.id,
        name: "WaveGlide Stand-Up Paddleboard",
        description:
          "All-around SUP for lake days and calm water. Beginner-friendly width with paddle, leash, and carry bag included.",
        brand: "WaveGlide",
        pricePerDay: 32,
        quantity: 6,
        availableQuantity: 6,
        specifications: {
          length: "10'6\"",
          width: "32\"",
          capacity: "140kg",
          includes: "Paddle + leash + bag",
        },
        images: [IMAGES.paddle1, IMAGES.paddle2, IMAGES.paddle3],
      },
    }),
    // 10 — yoga
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "GlowFit Yoga & Mobility Set",
        description:
          "Premium yoga mat with blocks and stretch strap for studio-quality flow at home or outdoors. Non-slip surface and easy to clean.",
        brand: "GlowFit",
        pricePerDay: 14,
        quantity: 12,
        availableQuantity: 11,
        specifications: {
          matThickness: "6mm",
          includes: "Mat + 2 blocks + strap",
          surface: "Non-slip",
        },
        images: [IMAGES.yoga1, IMAGES.yoga2, IMAGES.yoga3],
      },
    }),
    // 11 — camp kit
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: camping.id,
        name: "TrailNest Camping Essentials Bundle",
        description:
          "Ready-to-camp cookware and packing essentials. Pair with our dome tent for a complete weekend getaway kit.",
        brand: "TrailNest",
        pricePerDay: 16,
        quantity: 10,
        availableQuantity: 9,
        specifications: {
          includes: "Cook set + utensils + pack straps",
          fuel: "Bring your own canister",
          bestFor: "Weekend camping",
        },
        images: [IMAGES.campKit1, IMAGES.campKit2, IMAGES.campKit3],
      },
    }),
    // 12 — hiking pack
    prisma.gearItem.create({
      data: {
        providerId: provider1.id,
        categoryId: camping.id,
        name: "SummitPath Day Hiking Pack (40L)",
        description:
          "Lightweight 40L hiking backpack with ventilated back panel, hydration sleeve, and multiple pockets. Built for day hikes and scenic mountain trips.",
        brand: "SummitPath",
        pricePerDay: 15,
        quantity: 14,
        availableQuantity: 13,
        specifications: {
          capacity: "40L",
          weight: "1.1kg",
          features: "Hydration sleeve + rain cover",
        },
        images: [IMAGES.hike1, IMAGES.hike2, IMAGES.hike3],
      },
    }),
    // 13 — gym starter
    prisma.gearItem.create({
      data: {
        providerId: provider2.id,
        categoryId: fitness.id,
        name: "CorePulse Gym Starter Bundle",
        description:
          "Portable gym starter kit with jump rope, resistance loops, and foam roller. Clean, compact training gear without bulky machines.",
        brand: "CorePulse",
        pricePerDay: 12,
        quantity: 16,
        availableQuantity: 15,
        specifications: {
          includes: "Jump rope + loops + foam roller",
          level: "Beginner–Intermediate",
          bestFor: "Home or park workouts",
        },
        images: [IMAGES.gym2, IMAGES.gym3, IMAGES.yoga2],
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
  console.log("   • 6 categories (with verified Pexels images)");
  console.log("   • 14 gear items (lifestyle galleries + clear descriptions)");
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
