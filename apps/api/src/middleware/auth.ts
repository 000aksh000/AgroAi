import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'farmer' | 'admin';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    next(new AppError('Authentication token is required to access this resource.', 401, 'AUTHENTICATION_REQUIRED'));
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired authentication token. Please log in again.', 401, 'INVALID_TOKEN'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthUserPayload;
      req.user = decoded;
    } catch {
      // Ignore invalid optional tokens
    }
  }
  next();
}

export function requireRole(...allowedRoles: Array<'farmer' | 'admin'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          `Access forbidden. Requires one of roles: [${allowedRoles.join(', ')}].`,
          403,
          'FORBIDDEN_INSUFFICIENT_PERMISSIONS'
        )
      );
      return;
    }

    next();
  };
}
