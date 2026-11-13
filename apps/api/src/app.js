import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { ENV } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { farmRouter } from "./routes/farm.routes.js";
import { cropRouter } from "./routes/crop.routes.js";
import { diseaseRouter } from "./routes/disease.routes.js";
import { weatherRouter } from "./routes/weather.routes.js";
import { mandiRouter } from "./routes/mandi.routes.js";
import { assistantRouter } from "./routes/assistant.routes.js";
import { historyRouter } from "./routes/history.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { healthRouter } from "./routes/health.routes.js";
export const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: [ENV.CLIENT_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"]
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(requestLogger);
if (ENV.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use("/uploads", express.static(ENV.UPLOAD_DIR));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));
const v1 = express.Router();
v1.use("/health", healthRouter);
v1.use("/auth", authRouter);
v1.use("/farms", farmRouter);
v1.use("/crops", cropRouter);
v1.use("/diseases", diseaseRouter);
v1.use("/weather", weatherRouter);
v1.use("/mandi", mandiRouter);
v1.use("/assistant", assistantRouter);
v1.use("/history", historyRouter);
v1.use("/notifications", notificationRouter);
v1.use("/admin", adminRouter);
app.use(ENV.API_PREFIX, v1);
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to AgroSmart AI REST API Server",
    version: "1.0.0",
    documentation: "/docs",
    health: `${ENV.API_PREFIX}/health`
  });
});
app.use(errorHandler);
