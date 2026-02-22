import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 วัน

const restaurants = [
  {
    id: "rest-1",
    name: "ร้าน ณ.เพลินพุง", 
    address:
      "89/2 ซอย สุขุมวิท 66/1 แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260",
    latitude: 13.6812917,
    longitude: 100.60799139999999,
    source: "postgres",
  },
  {
    id: "rest-2",
    name: "เรือนเพชรสุกี้ ศรีนครินทร์ (ปากน้ำ)", 
    address:
      "222/174 หมู่ที่ 5 ถ. ศรีนครินทร์ ตำบล บางเมือง อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.597724699999999,
    longitude: 100.61150719999999,
    source: "postgres",
  },
  {
    id: "rest-3",
    name: "SEVENTY-SIX CAFE", 
    address:
      "710 หมู่ 1 ซอย เหรียญทอง ตำบล สำโรงเหนือ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.656231199999999,
    longitude: 100.5934898,
    source: "postgres",
  },
  {
    id: "rest-4",
    name: "Ombra Modern Tavern @Seenspace", 
    address:
      "251/1 ซอย ทองหล่อ 13 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    latitude: 13.733429399999999,
    longitude: 100.5812768,
    source: "postgres",
  },
  {
    id: "rest-5",
    name: "Embassy Room La Marina", 
    address:
      "9th Floor, Park Hyatt Bangkok, 88 ถ. วิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
    latitude: 13.7437274,
    longitude: 100.5473694,
    source: "postgres",
  },
  {
    id: "rest-6",
    name: "ครัวกรุงเทพ", 
    address:
      "เลขที่ 2 ซอย อร่ามศรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 10400",
    latitude: 13.7554275,
    longitude: 100.53265479999999,
    source: "postgres",
  },
  {
    id: "rest-7",
    name: "ร้านก๋วยเตี๋ยวหมูต้มยำยงเจริญ", 
    address: "ยงเจริญคอมเพล็ก แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.6933426,
    longitude: 100.63939459999999,
    source: "postgres",
  },
];

const searches = [
  { id: "search-1", keyword: "ร้าน ณ.เพลินพุง" },
  { id: "search-2", keyword: "เรือนเพชรสุกี้" },
  { id: "search-3", keyword: "seventy-six cafe" },
  { id: "search-4", keyword: "ombra modern" },
  { id: "search-5", keyword: "embassy room" },
  { id: "search-6", keyword: "ครัวกรุงเทพ" },
  { id: "search-7", keyword: "ก๋วยเตี๋ยวหมูต้มยำ" },
];

async function main() {
  const expiresAt = new Date(Date.now() + EXPIRY_MS);

  for (const restaurant of restaurants) {
    await prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: restaurant,
      create: restaurant,
    });
  }

  for (let i = 0; i < searches.length; i++) {
    const search = searches[i];
    const matchedRestaurant = restaurants.find((r) =>
      r.name.toLowerCase().includes(search.keyword.toLowerCase()),
    );

    if (!matchedRestaurant) continue;

    await prisma.search.upsert({
      where: { id: search.id },
      update: {
        keyword: search.keyword,
        expiresAt,
      },
      create: {
        id: search.id,
        keyword: search.keyword,
        expiresAt,
        results: {
          create: [{ restaurant: { connect: { id: matchedRestaurant.id } } }],
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
