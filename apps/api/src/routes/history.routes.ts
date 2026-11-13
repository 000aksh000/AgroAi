import { Router, Request, Response, NextFunction } from 'express';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { DiseaseDiagnosis } from '../models/DiseaseDiagnosis.js';
import { Farm } from '../models/Farm.js';
import { authenticate } from '../middleware/auth.js';

export const historyRouter = Router();

historyRouter.use(authenticate);

// Unified History (Crop + Disease)
historyRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = (req.query.type as string) || 'all';
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string, 10) || 15));
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);

    const items: any[] = [];

    if (type === 'all' || type === 'crop') {
      const crops = await CropRecommendation.find({ userId: req.user!.id })
        .sort({ createdAt: -1 })
        .limit(30);

      crops.forEach((c) => {
        items.push({
          id: c._id.toString(),
          type: 'crop_recommendation',
          title: `Crop Recommendation: ${c.result.primaryCrop}`,
          crop: c.result.primaryCrop,
          confidence: c.result.confidence,
          farmName: c.farmName,
          summary: c.result.rationale,
          createdAt: c.createdAt,
          details: c.toJSON(),
        });
      });
    }

    if (type === 'all' || type === 'disease') {
      const diseases = await DiseaseDiagnosis.find({ userId: req.user!.id })
        .sort({ createdAt: -1 })
        .limit(30);

      diseases.forEach((d) => {
        items.push({
          id: d._id.toString(),
          type: 'disease_diagnosis',
          title: `Disease Scan: ${d.result.prediction.diseaseName}`,
          crop: d.result.prediction.crop,
          confidence: d.result.prediction.confidence,
          severity: d.result.prediction.severity,
          isHealthy: d.result.prediction.isHealthy,
          imageUrl: d.imageUrl,
          summary: d.result.prediction.cause,
          createdAt: d.createdAt,
          details: d.toJSON(),
        });
      });
    }

    // Sort combined records by creation date descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const paginated = items.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// User Activity Statistics
historyRouter.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const [cropCount, diseaseCount, farmCount, recentDiseases] = await Promise.all([
      CropRecommendation.countDocuments({ userId }),
      DiseaseDiagnosis.countDocuments({ userId }),
      Farm.countDocuments({ userId }),
      DiseaseDiagnosis.find({ userId }).select('result.prediction.isHealthy').limit(50),
    ]);

    const healthyCount = recentDiseases.filter((d) => d.result.prediction.isHealthy).length;
    const healthyRatio = recentDiseases.length > 0 ? Math.round((healthyCount / recentDiseases.length) * 100) : 100;

    res.json({
      success: true,
      data: {
        totalCropRecommendations: cropCount,
        totalDiseaseScans: diseaseCount,
        totalFarms: farmCount,
        healthyCropPercentage: healthyRatio,
      },
    });
  } catch (error) {
    next(error);
  }
});
