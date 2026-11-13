import { Router } from "express";
import { MandiService } from "../services/mandiService.js";
import { MarketFavorite } from "../models/MarketFavorite.js";
import { authenticate } from "../middleware/auth.js";
import { validateQuery } from "../middleware/validation.js";
import { mandiQuerySchema } from "@agrosmart/shared-validation";
import { AppError } from "../middleware/errorHandler.js";
export const mandiRouter = Router();
mandiRouter.get(
  "/prices",
  validateQuery(mandiQuerySchema),
  async (req, res, next) => {
    try {
      const result = MandiService.getMandiPrices(req.query);
      res.json({
        success: true,
        data: result.records,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }
);
mandiRouter.get("/trend", async (req, res, next) => {
  try {
    const commodity = req.query.commodity || "Wheat";
    const basePrice = parseInt(req.query.basePrice, 10) || 2400;
    const trend = MandiService.getPriceTrend(commodity, basePrice);
    res.json({
      success: true,
      data: {
        commodity,
        trend
      }
    });
  } catch (error) {
    next(error);
  }
});
mandiRouter.get("/favorites", authenticate, async (req, res, next) => {
  try {
    const favorites = await MarketFavorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: favorites.map((f) => f.toJSON())
    });
  } catch (error) {
    next(error);
  }
});
mandiRouter.post("/favorites", authenticate, async (req, res, next) => {
  try {
    const { state, market, commodity } = req.body;
    if (!state || !market || !commodity) {
      throw new AppError("State, market, and commodity are required to save a favorite.", 400, "FIELDS_REQUIRED");
    }
    const fav = new MarketFavorite({
      userId: req.user.id,
      state,
      market,
      commodity
    });
    await fav.save();
    res.status(201).json({
      success: true,
      message: "Mandi market added to favorites.",
      data: fav.toJSON()
    });
  } catch (error) {
    next(error);
  }
});
mandiRouter.delete("/favorites/:id", authenticate, async (req, res, next) => {
  try {
    const fav = await MarketFavorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!fav) {
      throw new AppError("Favorite not found.", 404, "FAVORITE_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Favorite removed."
    });
  } catch (error) {
    next(error);
  }
});
