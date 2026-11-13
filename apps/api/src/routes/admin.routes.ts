import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { DiseaseDiagnosis } from '../models/DiseaseDiagnosis.js';
import { AuditLog } from '../models/AuditLog.js';
import { MLService } from '../services/mlService.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const adminRouter = Router();

// Enforce admin privileges across all admin routes
adminRouter.use(authenticate, requireRole('admin'));

// List Users
adminRouter.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const search = req.query.search as string;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: users.map((u) => u.toJSON()),
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

// Update User Role / Status
adminRouter.patch('/users/:id/role', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'admin'].includes(role)) {
      throw new AppError('Role must be either "farmer" or "admin".', 400, 'INVALID_ROLE');
    }

    const user = await User.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true });
    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    // Log admin audit event
    await AuditLog.create({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'UPDATE_USER_ROLE',
      targetType: 'User',
      targetId: user.id,
      details: { newRole: role },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Platform Analytics
adminRouter.get('/analytics', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalFarms, totalCropRecs, totalDiseaseScans, recentLogs] =
      await Promise.all([
        User.countDocuments(),
        Farm.countDocuments(),
        CropRecommendation.countDocuments(),
        DiseaseDiagnosis.countDocuments(),
        AuditLog.find().sort({ createdAt: -1 }).limit(10),
      ]);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          farms: totalFarms,
          cropRecommendations: totalCropRecs,
          diseaseScans: totalDiseaseScans,
        },
        recentAuditLogs: recentLogs.map((l) => l.toJSON()),
      },
    });
  } catch (error) {
    next(error);
  }
});

// System & ML Service Health
adminRouter.get('/system-health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const mlHealth = await MLService.checkHealth();
    const memUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        api: {
          status: 'healthy',
          uptimeSeconds: Math.round(process.uptime()),
          nodeVersion: process.version,
          memoryUsageMb: Math.round(memUsage.rss / (1024 * 1024)),
        },
        mlService: mlHealth,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Audit Logs
adminRouter.get('/audit-logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: logs.map((l) => l.toJSON()),
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
