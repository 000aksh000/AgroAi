import { Router, Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const notificationRouter = Router();

notificationRouter.use(authenticate);

// Get User Notifications
notificationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      userId: req.user!.id,
      isRead: false,
    });

    res.json({
      success: true,
      data: notifications.map((n) => n.toJSON()),
      meta: { unreadCount },
    });
  } catch (error) {
    next(error);
  }
});

// Mark Single Notification as Read
notificationRouter.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
    }

    res.json({
      success: true,
      data: notification.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Mark All Notifications as Read
notificationRouter.patch('/mark-all-read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany({ userId: req.user!.id, isRead: false }, { $set: { isRead: true } });
    res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
});

// Delete Notification
notificationRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!notification) {
      throw new AppError('Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Notification deleted.',
    });
  } catch (error) {
    next(error);
  }
});
