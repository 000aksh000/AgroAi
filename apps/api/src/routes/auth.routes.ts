import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { TokenService } from '../services/tokenService.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@agrosmart/shared-validation';
import { AppError } from '../middleware/errorHandler.js';

export const authRouter = Router();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register
authRouter.post(
  '/register',
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, phone, state, district } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone,
        state,
        district,
        role: 'farmer',
        isVerified: true,
      });

      await user.save();
      const tokens = await TokenService.issueTokens(user);

      res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          user: user.toJSON(),
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
authRouter.post(
  '/login',
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      const tokens = await TokenService.issueTokens(user);

      res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.json({
        success: true,
        message: 'Login successful.',
        data: {
          user: user.toJSON(),
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh Token
authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      throw new AppError('Refresh token is required.', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const { accessToken, refreshToken, user } = await TokenService.rotateRefreshToken(token);

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout
authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      await TokenService.revokeRefreshToken(token);
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

// Get Current User
authRouter.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Update Profile
authRouter.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user!.id, { $set: updates }, { new: true });
      if (!user) {
        throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
      }

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Change Password
authRouter.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('The current password provided is incorrect.', 400, 'INCORRECT_PASSWORD');
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      await user.save();
      await TokenService.revokeAllUserTokens(user.id);

      const tokens = await TokenService.issueTokens(user);
      res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({
        success: true,
        message: 'Password changed successfully. Other active sessions have been invalidated.',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  }
);
