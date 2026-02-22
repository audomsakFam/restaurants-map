import { Router } from "express";
import { SearchController } from "../controllers/search.controller.js";

const searchRouter = Router();
const searchController = new SearchController();

searchRouter.get("/", searchController.searchRestaurants);
searchRouter.get("/suggest", searchController.suggestRestaurants);

export default searchRouter;
