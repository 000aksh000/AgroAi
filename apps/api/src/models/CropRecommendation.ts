import mongoose, { Document, Schema } from 'mongoose';

export interface ICropRecommendationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  farmId?: mongoose.Types.ObjectId;
  farmName?: string;
  input: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    state?: string;
    district?: string;
    season?: string;
  };
  result: {
    primaryCrop: string;
    confidence: number;
    confidenceScore: number;
    rationale: string;
    growingSeason: string;
    waterRequirements: string;
    soilSuitability: string;
    alternatives: Array<{
      crop: string;
      confidence: number;
      expectedYieldScore: number;
      matchScorePercentage: number;
    }>;
    agronomicAdvice: {
      fertilizerGuidance: string;
      irrigationSchedule: string;
      pestRiskAssessment: string;
      marketPotential: string;
    };
    modelMetadata: {
      modelName: string;
      modelVersion: string;
      evaluationAccuracy: number;
      trainedDate: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const CropRecommendationSchema = new Schema<ICropRecommendationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', index: true },
    farmName: { type: String },
    input: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      soilPh: { type: Number, required: true },
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      rainfall: { type: Number, required: true },
      state: { type: String },
      district: { type: String },
      season: { type: String },
    },
    result: {
      primaryCrop: { type: String, required: true, index: true },
      confidence: { type: Number, required: true },
      confidenceScore: { type: Number, required: true },
      rationale: { type: String, required: true },
      growingSeason: { type: String, default: 'Optimal for current season' },
      waterRequirements: { type: String },
      soilSuitability: { type: String },
      alternatives: [
        {
          crop: String,
          confidence: Number,
          expectedYieldScore: Number,
          matchScorePercentage: Number,
        },
      ],
      agronomicAdvice: {
        fertilizerGuidance: String,
        irrigationSchedule: String,
        pestRiskAssessment: String,
        marketPotential: String,
      },
      modelMetadata: {
        modelName: String,
        modelVersion: String,
        evaluationAccuracy: Number,
        trainedDate: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        ret.userId = ret.userId?.toString();
        if (ret.farmId) ret.farmId = ret.farmId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

CropRecommendationSchema.index({ userId: 1, createdAt: -1 });

export const CropRecommendation = mongoose.model<ICropRecommendationDocument>(
  'CropRecommendation',
  CropRecommendationSchema
);
