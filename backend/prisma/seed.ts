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
    name: "เรือนเพชรสุกี้ สาขาราชพฤกษ์",
    address: "109 ถ. ราชพฤกษ์ บางระมาด, เขตตลิ่งชัน กรุงเทพมหานคร 10170",
    latitude: 13.769420499999999,
    longitude: 100.44366959999999,
    source: "postgres",
  },
  {
    id: "rest-4",
    name: "เรือนเพชรสุกี้ - ถนนเลี่ยงเมืองนนทบุรี (รัตนาธิเบศร์)",
    address:
      "5, 60 หมู่ที่ 1 ถนน เลี่ยงเมืองนนทบุรี บางกระสอ อำเภอเมืองนนทบุรี นนทบุรี 11000",
    latitude: 13.8726688,
    longitude: 100.4958875,
    source: "postgres",
  },
  {
    id: "rest-5",
    name: "เรือนเพชรสุกี้ - ร้านสุกี้โบราณและอาหารจีน ถนนเพชรบุรีตัดใหม่",
    address:
      "1903, 1905, 1907, 1909 ถ. เพชรบุรีตัดใหม่ Bangkapi, เขตห้วยขวาง กรุงเทพมหานคร 10310",
    latitude: 13.7481045,
    longitude: 100.57037109999999,
    source: "postgres",
  },
  {
    id: "rest-6",
    name: "SEVENTY-SIX CAFE",
    address:
      "710 หมู่ 1 ซอย เหรียญทอง ตำบล สำโรงเหนือ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.656231199999999,
    longitude: 100.5934898,
    source: "postgres",
  },
  {
    id: "rest-7",
    name: "Ombra Modern Tavern @Seenspace",
    address:
      "251/1 ซอย ทองหล่อ 13 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    latitude: 13.733429399999999,
    longitude: 100.5812768,
    source: "postgres",
  },
  {
    id: "rest-8",
    name: "Embassy Room La Marina",
    address:
      "9th Floor, Park Hyatt Bangkok, 88 ถ. วิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
    latitude: 13.7437274,
    longitude: 100.5473694,
    source: "postgres",
  },
  {
    id: "rest-9",
    name: "ครัวกรุงเทพ",
    address:
      "เลขที่ 2 ซอย อร่ามศรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 10400",
    latitude: 13.7554275,
    longitude: 100.53265479999999,
    source: "postgres",
  },
  {
    id: "rest-10",
    name: "ก๋วยเตี๋ยวต้มยำ ธิษณา",
    address:
      "เลขที่171 ซอย วชิรธรรมสาธิต 9 แขวงบางจาก เขตพระโขนง กรุงเทพมหานคร 10260",
    latitude: 13.6844979,
    longitude: 100.61768029999999,
    source: "postgres",
  },
  {
    id: "rest-11",
    name: "ร้านก๋วยเตี๋ยวหมูต้มยำยงเจริญ",
    address: "ยงเจริญคอมเพล็ก แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.6933426,
    longitude: 100.63939459999999,
    source: "postgres",
  },
  {
    id: "rest-12",
    name: "ร้านแกล้งชิม(ก๋วยเตี๋ยวนักวิ่ง) Noodles and Runners",
    address:
      "240 ถนน สุขุมวิท 105 14 ระหว่าง แขวงบางนาใต้ เขตบางนา กรุงเทพมหานคร 10260",
    latitude: 13.6608602,
    longitude: 100.6089145,
    source: "postgres",
  },
  {
    id: "rest-13",
    name: "เฮียจู๋ ก๋วยเตี๋ยวต้มยำหมูบะช่อ ลาดพร้าว71 ต้นตำรับ",
    address: "ซอย นาคนิวาส 8 ลาดพร้าว กรุงเทพมหานคร 10230",
    latitude: 13.803241400000001,
    longitude: 100.60709659999999,
    source: "postgres",
  },
  {
    id: "rest-14",
    name: "ก๋วยเตี๋ยวหมูต้มยำตำลึง นายเอก สาขา 55 แบริ่ง-ลาซาล ตัดใหม่",
    address:
      "Bearing - LaSalle Rd, ตำบล สำโรงเหนือ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.6532868,
    longitude: 100.6202334,
    source: "postgres",
  },
  {
    id: "rest-15",
    name: "เจ๊นิด ก๋วยเตี๋ยวหมูต้มยำสุพรรณ",
    address:
      "ซอย หมู่บ้านรินทร์ทอง ตำบลเทพารักษ์ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.6349487,
    longitude: 100.5987658,
    source: "postgres",
  },
  {
    id: "rest-16",
    name: "ร้านแม่แสตมป์ ก๋วยเตี๋ยวต้มยำหมูสับโบราณ",
    address:
      "19/3 กำเนิดทรัพยแมนชั่น ถนน เพชรพระราม แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310",
    latitude: 13.7447845,
    longitude: 100.5976823,
    source: "postgres",
  },
  {
    id: "rest-17",
    name: "ป๊อกป๊อก ก๋วยเตี๋ยวต้มยำสุโขทัย PoK PoK Sukhothai Noodle",
    address:
      "257 3 ซอย ปรีดี พนมยงค์ 13 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    latitude: 13.7207966,
    longitude: 100.59567919999999,
    source: "postgres",
  },
  {
    id: "rest-18",
    name: "ก๋วยเตี๋ยวต้มยำหมูบะช่อโบราณเฮียตง",
    address:
      "1010 Palm Island 42 ถ. เทพารักษ์ ตำบลเทพารักษ์ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.6375757,
    longitude: 100.6098811,
    source: "postgres",
  },
  {
    id: "rest-19",
    name: "ก๋วยเตี๋ยวหมูเทวดา ศรีนครินทร์",
    address: "40, 49 ถ. ศรีนครินทร์ แขวงบางนาใต้ เขตบางนา กรุงเทพมหานคร 10260",
    latitude: 13.6565712,
    longitude: 100.64307850000002,
    source: "postgres",
  },
  {
    id: "rest-20",
    name: "กะเพราถาด ก๋วยเตี๋ยวต้มยำโบราณ (ริมน้ำ) by นายยุ้ย",
    address:
      "289 เฉลิมพระเกียรติรัชกาลที่ 9 ซอย 30 แขวงดอกไม้ เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.681697,
    longitude: 100.69737310000001,
    source: "postgres",
  },
  {
    id: "rest-21",
    name: "งเดิมก๋วยเตี๋ยวต้มยำ(สุขุมวิท 101)",
    address:
      "869/476 ซอย ปุณณวิถี 47 แขวงบางจาก เขตพระโขนง กรุงเทพมหานคร 10260",
    latitude: 13.6991496,
    longitude: 100.6212532,
    source: "postgres",
  },
  {
    id: "rest-22",
    name: "ตุ๊ก ก๋วยเตี๋ยวหมูต้มยำเสาร์อาทิตย์เจ้าเก่า",
    address:
      "หมู่บ้าน ศรีเพชรการเคหะ ซอย 14 ตำบล บางเมือง อำเภอเมืองสมุทรปราการ สมุทรปราการ 10270",
    latitude: 13.623079599999999,
    longitude: 100.6141073,
    source: "postgres",
  },
  {
    id: "rest-23",
    name: "แม่ละเอียด ก๋วยเตี๋ยวต้มยำ ราชบุรี",
    address: "5 ซอย ทุ่งเศรษฐี แยก 43 แขวงดอกไม้ เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.6685658,
    longitude: 100.69566719999999,
    source: "postgres",
  },
  {
    id: "rest-24",
    name: "กิม ก๋วยเตี๋ยวต้มยำโบราณ",
    address: "ถ. พัฒนาการ แขวงประเวศ เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.706145099999999,
    longitude: 100.6697871,
    source: "postgres",
  },
  {
    id: "rest-25",
    name: "ก๋วยเตี๋ยวหมู ต้มยำ",
    address:
      "เลขที่ 50/13 ซอย เอกมัย2 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    latitude: 13.6925733,
    longitude: 100.578728,
    source: "postgres",
  },
  {
    id: "rest-26",
    name: "เล็กใหญ่ ก๋วยเตี๋ยวต้มยำโบราณ",
    address:
      "126/13 ซ. วิภาวดิรังสิต2 แยก 6 แขวงรัชดาภิเษก เขตดินแดง กรุงเทพมหานคร 10400",
    latitude: 13.7778919,
    longitude: 100.5591116,
    source: "postgres",
  },
  {
    id: "rest-27",
    name: "เตี๋ยวหมูต้มยำโคตรอร่อย",
    address: "234, 3-4 ถ. พัฒนาการ แขวงประเวศ เขตประเวศ กรุงเทพมหานคร 10250",
    latitude: 13.7266321,
    longitude: 100.65687659999999,
    source: "postgres",
  },
  {
    id: "rest-28",
    name: "รุ่งเรือง (ตั๋ง) ก๋วยเตี๋ยวหมูต้มยำ",
    address: "10/3 สุขุมวิท 26 แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110",
    latitude: 13.728437099999999,
    longitude: 100.57067239999999,
    source: "postgres",
  },
  {
    id: "rest-30",
    name: "ร้านก๋วยเตี๋ยวต้มยำสุโขทัย สุขุมวิท 81",
    address: "390 อ่อนนุช 10 สวนหลวง เขตสวนหลวง กรุงเทพมหานคร 10250",
    latitude: 13.706851499999999,
    longitude: 100.6065327,
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
