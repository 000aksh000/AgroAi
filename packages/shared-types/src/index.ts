// User and Authentication Types
export type UserRole = 'farmer' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  preferredLanguage?: string;
  state?: string;
  district?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: IUser;
  tokens: AuthTokens;
}

// Farm Management Types
export type SoilType =
  | 'Alluvial'
  | 'Black'
  | 'Red'
  | 'Laterite'
  | 'Arid/Desert'
  | 'Saline'
  | 'Peaty/Marshy'
  | 'Clay'
  | 'Sandy Loam'
  | 'Loamy';

export type IrrigationMethod =
  | 'Drip'
  | 'Sprinkler'
  | 'Flood/Surface'
  | 'Canal'
  | 'Rainfed'
  | 'Tube Well';

export type WaterAvailability = 'Abundant' | 'Moderate' | 'Scarce' | 'Seasonal Rainfed';

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';

export interface IFarm {
  id: string;
  userId: string;
  name: string;
  state: string;
  district: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  area: number;
  areaUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  soilType: SoilType;
  soilPh?: number;
  nitrogen?: number; // N in kg/ha or mg/kg
  phosphorus?: number; // P in kg/ha
  potassium?: number; // K in kg/ha
  irrigationMethod: IrrigationMethod;
  waterAvailability: WaterAvailability;
  currentCrops: string[];
  currentSeason?: CropSeason;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Crop Recommendation Types
export interface ICropRecommendationInput {
  farmId?: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  state?: string;
  district?: string;
  season?: CropSeason;
}

export interface ICropAlternative {
  crop: string;
  confidence: number;
  expectedYieldScore: number;
  matchScorePercentage: number;
}

export interface ICropRecommendationResult {
  primaryCrop: string;
  confidence: number;
  confidenceScore: number; // 0 to 1
  rationale: string;
  growingSeason: string;
  waterRequirements: string;
  soilSuitability: string;
  alternatives: ICropAlternative[];
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
}

export interface ICropRecommendationRecord {
  id: string;
  userId: string;
  farmId?: string;
  farmName?: string;
  input: ICropRecommendationInput;
  result: ICropRecommendationResult;
  createdAt: string;
}

// Plant Disease Detection Types
export interface IDiseaseInfo {
  diseaseName: string;
  scientificName?: string;
  crop: string;
  isHealthy: boolean;
  confidence: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  cause: string;
  preventionTips: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  expertAdvisoryNotes: string;
}

export interface IDiseaseDiagnosisResult {
  prediction: IDiseaseInfo;
  topMatches: Array<{
    label: string;
    confidence: number;
  }>;
  imageUrl: string;
  modelMetadata: {
    modelName: string;
    modelVersion: string;
    imageResolution: string;
  };
}

export interface IDiseaseDiagnosisRecord {
  id: string;
  userId: string;
  cropName?: string;
  imageUrl: string;
  result: IDiseaseDiagnosisResult;
  userNotes?: string;
  createdAt: string;
}

// AI Agricultural Assistant Types
export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  farmContextUsed?: string;
  timestamp: string;
}

export interface IConversation {
  id: string;
  userId: string;
  title: string;
  farmId?: string;
  messages: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Weather Types
export interface ICurrentWeather {
  temperature: number; // °C
  apparentTemperature: number;
  humidity: number; // %
  precipitation: number; // mm
  windSpeed: number; // km/h
  windDirection: number; // degrees
  weatherCode: number;
  weatherDescription: string;
  uvIndex?: number;
  pressure?: number;
  isDay: boolean;
}

export interface IForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeedMax: number;
}

export interface IAgriWeatherAdvisory {
  sprayingCondition: 'Optimal' | 'Caution' | 'Unfavorable';
  sprayingReason: string;
  irrigationNeed: 'Immediate' | 'Moderate' | 'Not Needed / Rainfall Expected';
  irrigationReason: string;
  harvestSafety: 'Safe' | 'Watch Forecast' | 'Risky due to rain';
  cropStressIndex: 'Low' | 'Moderate' | 'High Heat' | 'High Moisture';
}

export interface IWeatherData {
  location: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: ICurrentWeather;
  forecast: IForecastDay[];
  agriAdvisory: IAgriWeatherAdvisory;
  lastUpdated: string;
  source: string;
}

// Mandi / Market Price Types
export interface IMandiPriceRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrivalDate: string;
  minPrice: number; // INR per Quintal
  maxPrice: number;
  modalPrice: number;
  priceTrend?: 'up' | 'down' | 'stable';
  unit: string;
}

export interface IMandiPriceTrend {
  date: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface IMandiFilter {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Notifications
export type NotificationType =
  | 'weather_alert'
  | 'pest_warning'
  | 'market_price_alert'
  | 'farm_reminder'
  | 'system';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Generic API response formats
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    requestId: string;
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
  };
}
