import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { AppError } from "./errorHandler.js";
export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    next(new AppError("Authentication token is required to access this resource.", 401, "AUTHENTICATION_REQUIRED"));
    return;
  }
  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired authentication token. Please log in again.", 401, "INVALID_TOKEN"));
  }
}
export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
      req.user = decoded;
    } catch {
    }
  }
  next();
}
export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError("Authentication required.", 401, "AUTHENTICATION_REQUIRED"));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          `Access forbidden. Requires one of roles: [${allowedRoles.join(", ")}].`,
          403,
          "FORBIDDEN_INSUFFICIENT_PERMISSIONS"
        )
      );
      return;
    }
    next();
  };
}
