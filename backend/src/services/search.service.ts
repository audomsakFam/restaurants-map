import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import fetchFromGooglePlaces from "../libs/googlePlaces.js";
import { redis, safeRedis } from "../libs/redis.js";
const SEARCH_CACHE_TTL_SECONDS = 60;

function searchCacheKey(normalized: string) {
  return `restaurant:search:${normalized}`;
}

const SEARCH_KEYWORD_SET = "restaurant:keywords";

export class SearchService {
  constructor(private readonly db: PrismaClient) {}

  async searchRestaurantsCached(keyword: string) {
    const partial = keyword.trim().toLowerCase();
    if (!partial) return { source: "empty", data: [] };

    if (!redis.isOpen) return { source: "redis-closed", data: [] };

    const prefix = "restaurant:search:";
    const matches = new Set<string>();

    try {
      for await (const key of redis.scanIterator({
        MATCH: `${prefix}*${partial}*`,
        COUNT: 100,
      })) {
        if (typeof key !== "string") continue;
        const keyStr = key as string;
        if (!keyStr.startsWith(prefix)) continue;
        const keywordFromKey = keyStr.slice(prefix.length);
        if (keywordFromKey && keywordFromKey.includes(partial)) {
          matches.add(keywordFromKey);
        }
        if (matches.size >= 5) break;
      }

      if (matches.size < 5) {
        const savedKeywords = await redis.sMembers(SEARCH_KEYWORD_SET);
        for (const kw of savedKeywords) {
          if (typeof kw !== "string") continue;
          const normalizedKw = kw.toLowerCase();
          if (normalizedKw && normalizedKw.includes(partial)) {
            matches.add(normalizedKw);
            if (matches.size >= 5) break;
          }
        }
      }

      return { source: "redis", data: Array.from(matches).slice(0, 5) };
    } catch (error) {
      console.error("searchRestaurantsCached redis error", error);
      return { source: "error", data: [] };
    }
  }

  async searchRestaurants(keyword: string) {
    const normalized = keyword.trim().toLowerCase();
    const cacheKey = searchCacheKey(normalized);
    const cached = await safeRedis(() => redis.get(cacheKey));
    if (cached) {
      console.log(`validSearch hit : "${normalized}"`);
      console.log(`Cache  cached: "${cached}"`);
      return { source: "redis", data: JSON.parse(cached) };
    }
    console.log(`normalized after : "${normalized}"`);
    const validSearch = await this.db.search.findFirst({
      where: {
        keyword: normalized,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        results: {
          include: { restaurant: true },
        },
      },
    });
    console.log(`validSearch  : "${validSearch}"`);

    if (validSearch) {
      console.log(`Database hit for keyword: "${validSearch}"`);
      const data = validSearch.results.map((result) => ({
        id: result.restaurant.id,
        name: result.restaurant.name,
        address: result.restaurant.address,
        latitude: result.restaurant.latitude,
        longitude: result.restaurant.longitude,
        source: result.restaurant.source,
      }));

      await safeRedis(() =>
        redis.set(cacheKey, JSON.stringify(data), {
          EX: SEARCH_CACHE_TTL_SECONDS,
        }),
      );
      await safeRedis(() => redis.sAdd(SEARCH_KEYWORD_SET, normalized));
      console.log(
        `Database hit for keyword: "${normalized}" with data: "${JSON.stringify(data)}"`,
      );

      return { source: "postgres", data };
    }
    const externalData = await fetchFromGooglePlaces(normalized);

    await this.db.$transaction(async (tx) => {
      const search = await tx.search.create({
        data: {
          keyword: normalized,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
        },
      });
      for (const item of externalData) {
        const restaurant = await tx.restaurant.upsert({
          where: { id: item.id },
          update: {
            name: item.name,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
          },
          create: {
            id: item.id,
            name: item.name,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            source: "google",
          },
        });
        await tx.searchResult.create({
          data: {
            searchId: search.id,
            restaurantId: restaurant.id,
          },
        });
      }
    });

    await safeRedis(() =>
      redis.set(cacheKey, JSON.stringify(externalData), {
        EX: SEARCH_CACHE_TTL_SECONDS,
      }),
    );
    await safeRedis(() => redis.sAdd(SEARCH_KEYWORD_SET, normalized));
    return { source: "google", data: externalData };
  }
}
