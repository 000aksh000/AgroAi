import { Router } from "express";
import mongoose from "mongoose";
import { MLService } from "../services/mlService.js";
export const healthRouter = Router();
healthRouter.get("/", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  const mlHealth = await MLService.checkHealth();
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: Math.round(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || "unknown",
      connected: dbState === 1
    },
    mlService: mlHealth
  });
});
