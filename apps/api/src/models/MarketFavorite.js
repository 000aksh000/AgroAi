import mongoose, { Schema } from "mongoose";
const MarketFavoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    state: { type: String, required: true },
    market: { type: String, required: true },
    commodity: { type: String, required: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id?.toString();
        ret.userId = ret.userId?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
MarketFavoriteSchema.index({ userId: 1, market: 1, commodity: 1 }, { unique: true });
export const MarketFavorite = mongoose.model(
  "MarketFavorite",
  MarketFavoriteSchema
);
