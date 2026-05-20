import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.article.deleteMany();
  await db.user.deleteMany();
  await db.storeSettings.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await db.user.create({
    data: {
      name: "Admin",
      email: "admin@luxgemstech.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create customer
  await db.user.create({
    data: {
      name: "Test Customer",
      email: "customer@test.com",
      password: await bcrypt.hash("customer123", 10),
      role: "customer",
    },
  });

  // Create categories
  const jewelry = await db.category.create({
    data: { name: "Jewelry", slug: "jewelry" },
  });
  const electronics = await db.category.create({
    data: { name: "Electronics", slug: "electronics" },
  });
  console.log("Created categories");

  // Create sample products - Jewelry
  const jewelryProducts = [
    {
      title: "Eternal Radiance Diamond Ring",
      slug: "eternal-radiance-diamond-ring",
      description: "A stunning 18K white gold ring featuring a brilliant 1.5 carat round diamond surrounded by a halo of smaller diamonds.",
      price: 2999.00,
      comparePrice: 3999.00,
      stock: 10,
      sku: "JWL-001",
      featured: true,
      material: "18K White Gold",
      gemstone: "Diamond",
      weight: 3.2,
    },
    {
      title: "Sapphire Elegance Necklace",
      slug: "sapphire-elegance-necklace",
      description: "A breathtaking 14K white gold pendant featuring a natural Ceylon blue sapphire (2.8ct) surrounded by intricate diamond accents.",
      price: 1850.00,
      comparePrice: 2200.00,
      stock: 5,
      sku: "JWL-002",
      featured: true,
      material: "14K White Gold",
      gemstone: "Sapphire",
      weight: 5.1,
    },
    {
      title: "Pearl Perfection Earrings",
      slug: "pearl-perfection-earrings",
      description: "Exquisite South Sea pearl drop earrings set in 18K gold with diamond caps. Each pearl measures 10-11mm.",
      price: 890.00,
      comparePrice: null,
      stock: 15,
      sku: "JWL-003",
      featured: true,
      material: "18K Gold",
      gemstone: "Pearl",
      weight: 4.5,
    },
    {
      title: "Art Deco Emerald Bracelet",
      slug: "art-deco-emerald-bracelet",
      description: "Inspired by the Art Deco era, this bracelet features alternating Colombian emeralds and diamonds set in platinum.",
      price: 4500.00,
      comparePrice: 5500.00,
      stock: 3,
      sku: "JWL-004",
      featured: false,
      material: "Platinum",
      gemstone: "Emerald",
      weight: 12.8,
    },
    {
      title: "Rose Gold Tennis Bracelet",
      slug: "rose-gold-tennis-bracelet",
      description: "A classic tennis bracelet reimagined in 18K rose gold. Features 5.0 carats total weight of round brilliant diamonds.",
      price: 3200.00,
      comparePrice: null,
      stock: 7,
      sku: "JWL-005",
      featured: true,
      material: "18K Rose Gold",
      gemstone: "Diamond",
      weight: 8.6,
    },
  ];

  // Create electronics products
  const electronicsProducts = [
    {
      title: "ProSound Wireless Earbuds X1",
      slug: "prosound-wireless-earbuds-x1",
      description: "Premium true wireless earbuds with Active Noise Cancellation (ANC), spatial audio, and 36-hour total battery life.",
      price: 199.00,
      comparePrice: 249.00,
      stock: 50,
      sku: "ELC-001",
      featured: true,
      material: null,
      gemstone: null,
      weight: null,
    },
    {
      title: "SmartView 4K Portable Projector",
      slug: "smartview-4k-portable-projector",
      description: "Compact 4K HDR projector with 2000 ANSI lumens, auto keystone correction, and built-in streaming apps.",
      price: 599.00,
      comparePrice: 799.00,
      stock: 20,
      sku: "ELC-002",
      featured: true,
      material: null,
      gemstone: null,
      weight: null,
    },
    {
      title: "UltraCharge GaN Power Station",
      slug: "ultracharge-gan-power-station",
      description: "300W portable power station with GaN technology. Features 2 AC outlets, 4 USB-C ports (100W PD).",
      price: 349.00,
      comparePrice: 399.00,
      stock: 30,
      sku: "ELC-003",
      featured: false,
      material: null,
      gemstone: null,
      weight: null,
    },
    {
      title: "Zenith Smartwatch Pro",
      slug: "zenith-smartwatch-pro",
      description: "Premium smartwatch with 1.9\" AMOLED display, health monitoring, GPS, and 14-day battery life.",
      price: 449.00,
      comparePrice: null,
      stock: 25,
      sku: "ELC-004",
      featured: true,
      material: null,
      gemstone: null,
      weight: null,
    },
  ];

  const allProducts = [...jewelryProducts, ...electronicsProducts];
  for (const p of allProducts) {
    const categoryId = p.material ? jewelry.id : electronics.id;
    await db.product.create({
      data: {
        ...p,
        images: JSON.stringify([]),
        description: JSON.stringify({ zh: p.description, en: p.description }),
        currency: "USD",
        published: true,
        categoryId,
        specs: JSON.stringify({
          Brand: "LuxGems & Tech",
          "Made In": "Premium Import",
          Warranty: "2 Years",
        }),
      },
    });
  }
  console.log(`Created ${allProducts.length} products`);

  // Create blog articles
  const articles = [
    {
      title: "How to Choose the Perfect Engagement Ring",
      slug: "how-to-choose-engagement-ring",
      excerpt: "A comprehensive guide to selecting the ideal engagement ring, from understanding the 4Cs to choosing the right setting.",
      content: "# How to Choose the Perfect Engagement Ring\n\nChoosing an engagement ring is one of the most significant purchases you'll ever make.\n\n## Understanding the 4Cs\n\n### Cut\nThe cut determines how well a diamond reflects light.",
    },
    {
      title: "2025 Tech Trends: What's Worth Buying",
      slug: "2025-tech-trends",
      excerpt: "From AI-powered devices to next-gen wearables, discover the tech innovations that are genuinely worth your investment.",
      content: "# 2025 Tech Trends\n\nThe tech landscape is evolving faster than ever. Here's our curated list of innovations that deliver real value.",
    },
  ];

  for (const article of articles) {
    await db.article.create({
      data: { ...article, published: true },
    });
  }
  console.log("Created blog articles");

  // Create store settings
  await db.storeSettings.create({
    data: {
      storeName: "LuxGems & Tech",
      description: "Premium Jewelry & Electronics — Curated Excellence, Worldwide Delivery",
      primaryColor: "#1a1a2e",
    },
  });
  console.log("Created store settings");

  // Create shipping rates
  await db.shippingRate.createMany({
    data: [
      { name: "USPS Ground Advantage", carrier: "USPS", serviceName: "Ground Advantage", baseRate: 4.99, estimatedDays: "5-7 business days", zone: "domestic" },
      { name: "USPS Priority Mail", carrier: "USPS", serviceName: "Priority Mail", baseRate: 8.99, estimatedDays: "2-3 business days", zone: "domestic" },
      { name: "FedEx 2Day", carrier: "FedEx", serviceName: "2Day", baseRate: 14.99, estimatedDays: "2 business days", zone: "domestic" },
      { name: "FedEx Overnight", carrier: "FedEx", serviceName: "Standard Overnight", baseRate: 24.99, estimatedDays: "1 business day", zone: "domestic" },
    ],
  });
  console.log("Created shipping rates");

  // Create default warehouse
  await db.warehouse.create({
    data: {
      name: "US Main Warehouse",
      address: "350 Fifth Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10118",
      country: "US",
    },
  });
  console.log("Created warehouse");

  console.log("\nSeed complete!");
  console.log("Admin login: admin@luxgemstech.com / admin123");
  console.log("Customer login: customer@test.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
