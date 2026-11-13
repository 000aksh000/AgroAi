import { Router } from "express";
import { Notification } from "../models/Notification.js";
import { authenticate } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get("/", async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });
    res.json({
      success: true,
      data: notifications.map((n) => n.toJSON()),
      meta: { unreadCount }
    });
  } catch (error) {
    next(error);
  }
});
notificationRouter.patch("/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notification) {
      throw new AppError("Notification not found.", 404, "NOTIFICATION_NOT_FOUND");
    }
    res.json({
      success: true,
      data: notification.toJSON()
    });
  } catch (error) {
    next(error);
  }
});
notificationRouter.patch("/mark-all-read", async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { $set: { isRead: true } });
    res.json({
      success: true,
      message: "All notifications marked as read."
    });
  } catch (error) {
    next(error);
  }
});
notificationRouter.delete("/:id", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!notification) {
      throw new AppError("Notification not found.", 404, "NOTIFICATION_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Notification deleted."
    });
  } catch (error) {
    next(error);
  }
});
