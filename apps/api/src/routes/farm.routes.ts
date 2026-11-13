import { Router, Request, Response, NextFunction } from 'express';
import { Farm } from '../models/Farm.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { farmSchema } from '@agrosmart/shared-validation';
import { AppError } from '../middleware/errorHandler.js';

export const farmRouter = Router();

// All farm routes require authentication
farmRouter.use(authenticate);

// List Farms
farmRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farms = await Farm.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: farms.map((f) => f.toJSON()),
    });
  } catch (error) {
    next(error);
  }
});

// Create Farm
farmRouter.post('/', validateBody(farmSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farm = new Farm({
      ...req.body,
      userId: req.user!.id,
    });

    await farm.save();

    res.status(201).json({
      success: true,
      message: 'Farm profile created successfully.',
      data: farm.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Get Single Farm
farmRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!farm) {
      throw new AppError('Farm not found or you do not have permission to access it.', 404, 'FARM_NOT_FOUND');
    }

    res.json({
      success: true,
      data: farm.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Update Farm
farmRouter.put('/:id', validateBody(farmSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!farm) {
      throw new AppError('Farm not found or you do not have permission to modify it.', 404, 'FARM_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Farm profile updated successfully.',
      data: farm.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Delete Farm
farmRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!farm) {
      throw new AppError('Farm not found or you do not have permission to delete it.', 404, 'FARM_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Farm profile deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});
