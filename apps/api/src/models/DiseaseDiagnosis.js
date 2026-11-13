import mongoose, { Schema } from "mongoose";
const DiseaseDiagnosisSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cropName: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    imageStorageKey: { type: String },
    result: {
      prediction: {
        diseaseName: { type: String, required: true },
        scientificName: String,
        crop: { type: String, required: true },
        isHealthy: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
        severity: { type: String, default: "Moderate" },
        symptoms: [String],
        cause: String,
        preventionTips: [String],
        organicTreatment: [String],
        chemicalTreatment: [String],
        expertAdvisoryNotes: String
      },
      topMatches: [
        {
          label: String,
          confidence: Number
        }
      ],
      modelMetadata: {
        modelName: String,
        modelVersion: String,
        imageResolution: String
      }
    },
    userNotes: { type: String, maxlength: 1e3 }
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
DiseaseDiagnosisSchema.index({ userId: 1, createdAt: -1 });
export const DiseaseDiagnosis = mongoose.model(
  "DiseaseDiagnosis",
  DiseaseDiagnosisSchema
);
