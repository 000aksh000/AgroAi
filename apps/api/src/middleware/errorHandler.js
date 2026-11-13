import { ZodError } from "zod";
export class AppError extends Error {
  statusCode;
  errorCode;
  details;
  constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR", details) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export function errorHandler(err, req, res, next) {
  const requestId = req.requestId || "req-unknown";
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  if (err instanceof ZodError || err?.name === "ZodError" || Array.isArray(err?.issues)) {
    const details = typeof err.flatten === "function" ? err.flatten().fieldErrors : err.issues;
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request payload contains invalid values.",
        details,
        requestId,
        timestamp
      }
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details,
        requestId,
        timestamp
      }
    });
    return;
  }
  if (err.code === 11e3) {
    const field = Object.keys(err.keyValue || {})[0] || "record";
    res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_ENTRY",
        message: `A record with this ${field} already exists.`,
        requestId,
        timestamp
      }
    });
    return;
  }
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_IDENTIFIER",
        message: `Resource identifier '${err.value}' is not valid.`,
        requestId,
        timestamp
      }
    });
    return;
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Your authentication token is invalid or has expired. Please sign in again.",
        requestId,
        timestamp
      }
    });
    return;
  }
  console.error(`[Unhandled Error] [${requestId}]:`, err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected internal server error occurred. Please try again later.",
      requestId,
      timestamp
    }
  });
}
