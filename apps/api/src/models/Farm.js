import mongoose, { Schema } from "mongoose";
const FarmSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    district: { type: String, required: true, trim: true, index: true },
    village: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    area: { type: Number, required: true, min: 0.01 },
    areaUnit: {
      type: String,
      enum: ["Acres", "Hectares", "Bigha", "Guntha"],
      default: "Acres"
    },
    soilType: {
      type: String,
      required: true,
      enum: [
        "Alluvial",
        "Black",
        "Red",
        "Laterite",
        "Arid/Desert",
        "Saline",
        "Peaty/Marshy",
        "Clay",
        "Sandy Loam",
        "Loamy"
      ]
    },
    soilPh: { type: Number, min: 3, max: 10 },
    nitrogen: { type: Number, min: 0, max: 500 },
    phosphorus: { type: Number, min: 0, max: 300 },
    potassium: { type: Number, min: 0, max: 500 },
    irrigationMethod: {
      type: String,
      required: true,
      enum: ["Drip", "Sprinkler", "Flood/Surface", "Canal", "Rainfed", "Tube Well"]
    },
    waterAvailability: {
      type: String,
      required: true,
      enum: ["Abundant", "Moderate", "Scarce", "Seasonal Rainfed"]
    },
    currentCrops: [{ type: String, trim: true }],
    currentSeason: { type: String, enum: ["Kharif", "Rabi", "Zaid", "Perennial"] },
    notes: { type: String, maxlength: 1e3 }
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
FarmSchema.index({ userId: 1, name: 1 });
export const Farm = mongoose.model("Farm", FarmSchema);
