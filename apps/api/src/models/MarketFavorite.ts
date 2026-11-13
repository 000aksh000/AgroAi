import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketFavoriteDocument extends Document {
  userId: mongoose.Types.ObjectId;
  state: string;
  market: string;
  commodity: string;
  createdAt: Date;
}

const MarketFavoriteSchema = new Schema<IMarketFavoriteDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    state: { type: String, required: true },
    market: { type: String, required: true },
    commodity: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        ret.userId = ret.userId?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

MarketFavoriteSchema.index({ userId: 1, market: 1, commodity: 1 }, { unique: true });

export const MarketFavorite = mongoose.model<IMarketFavoriteDocument>(
  'MarketFavorite',
  MarketFavoriteSchema
);
