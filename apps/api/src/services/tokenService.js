import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
export class TokenService {
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
  }
  static generateRefreshToken() {
    return uuidv4() + "-" + Date.now().toString(36);
  }
  static async issueTokens(user) {
    const accessToken = this.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    });
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift();
    }
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt,
      createdAt: /* @__PURE__ */ new Date()
    });
    await user.save();
    return { accessToken, refreshToken };
  }
  static async rotateRefreshToken(token) {
    const user = await User.findOne({ "refreshTokens.token": token });
    if (!user) {
      throw new AppError("Invalid or expired refresh token. Please log in again.", 401, "INVALID_REFRESH_TOKEN");
    }
    const tokenRecord = user.refreshTokens.find((r) => r.token === token);
    if (!tokenRecord || /* @__PURE__ */ new Date() > tokenRecord.expiresAt) {
      user.refreshTokens = user.refreshTokens.filter((r) => r.token !== token);
      await user.save();
      throw new AppError("Refresh token has expired. Please log in again.", 401, "EXPIRED_REFRESH_TOKEN");
    }
    user.refreshTokens = user.refreshTokens.filter((r) => r.token !== token);
    const { accessToken, refreshToken } = await this.issueTokens(user);
    return { accessToken, refreshToken, user };
  }
  static async revokeRefreshToken(token) {
    await User.updateOne(
      { "refreshTokens.token": token },
      { $pull: { refreshTokens: { token } } }
    );
  }
  static async revokeAllUserTokens(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokens: [] });
  }
}
