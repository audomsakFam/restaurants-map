import { Request, Response } from "express";
import prisma from "../libs/prisma-client.js";
import { SearchService } from "../services/search.service.js";

const searchService = new SearchService(prisma);

export class SearchController {
  searchRestaurants = async (req: Request, res: Response) => {
    const keywordFromQuery = req.query.keyword;

    if (typeof keywordFromQuery !== "string" || !keywordFromQuery.trim()) {
      return res.status(400).json({ error: "keyword must be a non-empty string" });
    }

    const keyword = keywordFromQuery.trim();

    if (!keyword) {
      return res.status(400).json({ error: "keyword is required" });
    }

    try {
      const result = await searchService.searchRestaurants(keyword);
      return res.json(result);
    } catch (error) {
      console.error("Failed to search restaurants:", error);
      return res.status(500).json({ error: "Failed to search restaurants" });
    }
  };

  suggestRestaurants = async (req: Request, res: Response) => {
    const keywordFromQuery = req.query.keyword;

    if (typeof keywordFromQuery !== "string" || !keywordFromQuery.trim()) {
      return res.json({ source: "empty", data: [] });
    }

    const keyword = keywordFromQuery.trim();

    try {
      const result = await searchService.searchRestaurantsCached(keyword);
      return res.json(result);
    } catch (error) {
      console.error("Failed to suggest restaurants:", error);
      return res.json({ source: "error", data: [] });
    }
  };
}
