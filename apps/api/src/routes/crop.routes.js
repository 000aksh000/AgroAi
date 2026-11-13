import { Router } from "express";
import { CropRecommendation } from "../models/CropRecommendation.js";
import { Farm } from "../models/Farm.js";
import { MLService } from "../services/mlService.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { cropRecommendationInputSchema } from "@agrosmart/shared-validation";
import { AppError } from "../middleware/errorHandler.js";
export const cropRouter = Router();
cropRouter.use(authenticate);
cropRouter.post(
  "/recommend",
  validateBody(cropRecommendationInputSchema),
  async (req, res, next) => {
    try {
      const input = req.body;
      let farmName;
      if (input.farmId) {
        const farm = await Farm.findOne({ _id: input.farmId, userId: req.user.id });
        if (farm) {
          farmName = farm.name;
        }
      }
      const mlResult = await MLService.recommendCrop({
        nitrogen: input.nitrogen,
        phosphorus: input.phosphorus,
        potassium: input.potassium,
        soilPh: input.soilPh,
        temperature: input.temperature,
        humidity: input.humidity,
        rainfall: input.rainfall,
        state: input.state,
        district: input.district,
        season: input.season
      });
      const record = new CropRecommendation({
        userId: req.user.id,
        farmId: input.farmId,
        farmName,
        input,
        result: {
          primaryCrop: mlResult.primaryCrop,
          confidence: mlResult.confidence,
          confidenceScore: mlResult.confidenceScore,
          rationale: mlResult.rationale,
          growingSeason: mlResult.growingSeason,
          waterRequirements: mlResult.waterRequirements,
          soilSuitability: mlResult.soilSuitability,
          alternatives: mlResult.alternatives || [],
          agronomicAdvice: mlResult.agronomicAdvice,
          modelMetadata: mlResult.modelMetadata
        }
      });
      await record.save();
      res.status(201).json({
        success: true,
        message: `Recommendation generated: ${mlResult.primaryCrop} with ${(mlResult.confidence * 100).toFixed(1)}% confidence score.`,
        data: record.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }
);
cropRouter.get("/history", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const crop = req.query.crop;
    const farmId = req.query.farmId;
    const filter = { userId: req.user.id };
    if (crop) {
      filter["result.primaryCrop"] = { $regex: crop, $options: "i" };
    }
    if (farmId) {
      filter.farmId = farmId;
    }
    const total = await CropRecommendation.countDocuments(filter);
    const records = await CropRecommendation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({
      success: true,
      data: records.map((r) => r.toJSON()),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
});
cropRouter.get("/:id", async (req, res, next) => {
  try {
    const record = await CropRecommendation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      throw new AppError("Recommendation record not found.", 404, "RECORD_NOT_FOUND");
    }
    res.json({
      success: true,
      data: record.toJSON()
    });
  } catch (error) {
    next(error);
  }
});
cropRouter.delete("/:id", async (req, res, next) => {
  try {
    const record = await CropRecommendation.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      throw new AppError("Recommendation record not found or access denied.", 404, "RECORD_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Recommendation record deleted successfully."
    });
  } catch (error) {
    next(error);
  }
});
