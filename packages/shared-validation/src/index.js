import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(80),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must include at least one uppercase letter").regex(/[a-z]/, "Password must include at least one lowercase letter").regex(/[0-9]/, "Password must include at least one number"),
  phone: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional()
});
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  preferredLanguage: z.string().optional()
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").regex(/[A-Z]/, "Must include uppercase").regex(/[a-z]/, "Must include lowercase").regex(/[0-9]/, "Must include number")
});
export const soilTypeEnum = z.enum([
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
]);
export const irrigationMethodEnum = z.enum([
  "Drip",
  "Sprinkler",
  "Flood/Surface",
  "Canal",
  "Rainfed",
  "Tube Well"
]);
export const waterAvailabilityEnum = z.enum([
  "Abundant",
  "Moderate",
  "Scarce",
  "Seasonal Rainfed"
]);
export const cropSeasonEnum = z.enum(["Kharif", "Rabi", "Zaid", "Perennial"]);
export const farmSchema = z.object({
  name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  village: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  area: z.number().positive("Area must be a positive number"),
  areaUnit: z.enum(["Acres", "Hectares", "Bigha", "Guntha"]).default("Acres"),
  soilType: soilTypeEnum,
  soilPh: z.number().min(3, "pH must be >= 3.0").max(10, "pH must be <= 10.0").optional(),
  nitrogen: z.number().min(0, "Nitrogen must be >= 0").max(500, "Nitrogen value out of range").optional(),
  phosphorus: z.number().min(0, "Phosphorus must be >= 0").max(300, "Phosphorus value out of range").optional(),
  potassium: z.number().min(0, "Potassium must be >= 0").max(500, "Potassium value out of range").optional(),
  irrigationMethod: irrigationMethodEnum,
  waterAvailability: waterAvailabilityEnum,
  currentCrops: z.array(z.string()).default([]),
  currentSeason: cropSeasonEnum.optional(),
  notes: z.string().max(1e3).optional()
});
export const cropRecommendationInputSchema = z.object({
  farmId: z.string().optional(),
  nitrogen: z.number().min(0, "Nitrogen must be >= 0 kg/ha").max(300, "Nitrogen must be <= 300 kg/ha"),
  phosphorus: z.number().min(0, "Phosphorus must be >= 0 kg/ha").max(200, "Phosphorus must be <= 200 kg/ha"),
  potassium: z.number().min(0, "Potassium must be >= 0 kg/ha").max(300, "Potassium must be <= 300 kg/ha"),
  soilPh: z.number().min(3.5, "pH must be >= 3.5").max(9.5, "pH must be <= 9.5"),
  temperature: z.number().min(5, "Temperature must be >= 5\xB0C").max(55, "Temperature must be <= 55\xB0C"),
  humidity: z.number().min(10, "Humidity must be >= 10%").max(100, "Humidity must be <= 100%"),
  rainfall: z.number().min(0, "Rainfall must be >= 0 mm").max(500, "Rainfall must be <= 500 mm"),
  state: z.string().optional(),
  district: z.string().optional(),
  season: cropSeasonEnum.optional()
});
export const chatMessageInputSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty").max(2e3, "Message is too long"),
  farmId: z.string().optional()
});
export const newConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  farmId: z.string().optional()
});
export const weatherQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  city: z.string().optional(),
  farmId: z.string().optional()
});
export const mandiQuerySchema = z.object({
  state: z.string().optional(),
  district: z.string().optional(),
  market: z.string().optional(),
  commodity: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});
