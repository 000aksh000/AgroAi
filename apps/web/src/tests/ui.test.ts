import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  farmSchema,
  cropRecommendationInputSchema,
} from '@agrosmart/shared-validation';

describe('Frontend Form Validations & Schemas', () => {
  it('should validate complete farmer registration form inputs', () => {
    const validRegistration = {
      name: 'Balwinder Singh',
      email: 'balwinder@punjabfarms.in',
      password: 'StrongPassword1',
      phone: '+919876543210',
      state: 'Punjab',
      district: 'Ludhiana',
    };

    const parsed = registerSchema.safeParse(validRegistration);
    expect(parsed.success).toBe(true);
  });

  it('should reject registration passwords lacking uppercase or numbers', () => {
    const invalidRegistration = {
      name: 'Kisan',
      email: 'kisan@example.com',
      password: 'weakpassword',
    };

    const parsed = registerSchema.safeParse(invalidRegistration);
    expect(parsed.success).toBe(false);
  });

  it('should validate farm creation with proper soil & area units', () => {
    const validFarm = {
      name: 'Nashik South Farm Plot',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Lasalgaon',
      area: 3.5,
      areaUnit: 'Acres' as const,
      soilType: 'Black' as const,
      soilPh: 6.8,
      nitrogen: 85,
      phosphorus: 45,
      potassium: 40,
      irrigationMethod: 'Drip' as const,
      waterAvailability: 'Moderate' as const,
      currentCrops: ['Onion', 'Tomato'],
    };

    const parsed = farmSchema.safeParse(validFarm);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid soil pH measurements out of agronomic bounds', () => {
    const invalidFarm = {
      name: 'Bad pH Farm',
      state: 'Punjab',
      district: 'Amritsar',
      area: 2.0,
      soilType: 'Alluvial' as const,
      soilPh: 14.5, // Invalid pH
      irrigationMethod: 'Canal' as const,
      waterAvailability: 'Abundant' as const,
    };

    const parsed = farmSchema.safeParse(invalidFarm);
    expect(parsed.success).toBe(false);
  });

  it('should validate AI crop recommendation inputs within safe ranges', () => {
    const cropInputs = {
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      soilPh: 6.5,
      temperature: 26,
      humidity: 80,
      rainfall: 200,
    };

    const parsed = cropRecommendationInputSchema.safeParse(cropInputs);
    expect(parsed.success).toBe(true);
  });
});
