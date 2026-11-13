import { Router, Request, Response, NextFunction } from 'express';
import { DiseaseDiagnosis } from '../models/DiseaseDiagnosis.js';
import { MLService } from '../services/mlService.js';
import { leafImageUpload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const diseaseRouter = Router();

diseaseRouter.use(authenticate);

// Detect Disease from uploaded leaf image
diseaseRouter.post(
  '/detect',
  leafImageUpload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('Please select or capture a leaf image file to upload.', 400, 'FILE_REQUIRED');
      }

      const cropName = req.body.cropName || 'Unspecified';
      const userNotes = req.body.userNotes || '';

      // Call ML Service with uploaded file
      const mlResult = await MLService.detectDisease(
        req.file.path,
        req.file.originalname,
        req.file.mimetype
      );

      const imageUrl = `/uploads/${req.file.filename}`;

      // Save to Diagnosis History
      const diagnosis = new DiseaseDiagnosis({
        userId: req.user!.id,
        cropName,
        imageUrl,
        imageStorageKey: req.file.filename,
        result: {
          prediction: mlResult.prediction,
          topMatches: mlResult.topMatches || [],
          modelMetadata: mlResult.modelMetadata,
        },
        userNotes,
      });

      await diagnosis.save();

      res.status(201).json({
        success: true,
        message: `Analysis completed: ${mlResult.prediction.diseaseName} detected with ${(mlResult.prediction.confidence * 100).toFixed(1)}% confidence.`,
        data: diagnosis.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get Diagnosis History
diseaseRouter.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string, 10) || 10));
    const crop = req.query.crop as string;

    const filter: any = { userId: req.user!.id };
    if (crop) {
      filter['result.prediction.crop'] = { $regex: crop, $options: 'i' };
    }

    const total = await DiseaseDiagnosis.countDocuments(filter);
    const records = await DiseaseDiagnosis.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: records.map((r) => r.toJSON()),
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

// Get Single Diagnosis Details
diseaseRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diagnosis = await DiseaseDiagnosis.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!diagnosis) {
      throw new AppError('Diagnosis record not found.', 404, 'RECORD_NOT_FOUND');
    }

    res.json({
      success: true,
      data: diagnosis.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Delete Diagnosis Record
diseaseRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diagnosis = await DiseaseDiagnosis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!diagnosis) {
      throw new AppError('Diagnosis record not found or access denied.', 404, 'RECORD_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Diagnosis record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});
