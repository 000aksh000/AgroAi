import { v4 as uuidv4 } from "uuid";
export function requestLogger(req, res, next) {
  req.requestId = req.headers["x-request-id"] || uuidv4();
  req.startTime = Date.now();
  res.setHeader("X-Request-Id", req.requestId);
  res.on("finish", () => {
    const duration = Date.now() - req.startTime;
    console.log(
      `[${(/* @__PURE__ */ new Date()).toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
}
