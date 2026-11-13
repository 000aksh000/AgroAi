// AgroSmart AI - Shared Domain Entities and Enumerations (JavaScript)

export const UserRoles = Object.freeze(['farmer', 'admin']);

export const SoilTypes = Object.freeze([
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Arid/Desert',
  'Saline',
  'Peaty/Marshy',
  'Clay',
  'Sandy Loam',
  'Loamy',
]);

export const IrrigationMethods = Object.freeze([
  'Drip',
  'Sprinkler',
  'Flood/Surface',
  'Canal',
  'Rainfed',
  'Tube Well',
]);

export const WaterAvailabilities = Object.freeze([
  'Abundant',
  'Moderate',
  'Scarce',
  'Seasonal Rainfed',
]);

export const CropSeasons = Object.freeze(['Kharif', 'Rabi', 'Zaid', 'Perennial']);

export const MandiCategories = Object.freeze([
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Vegetables',
  'Fruits',
  'Spices',
  'Cash Crops',
]);

export const NotificationTypes = Object.freeze([
  'weather_alert',
  'price_spike',
  'disease_warning',
  'system',
]);

export default {
  UserRoles,
  SoilTypes,
  IrrigationMethods,
  WaterAvailabilities,
  CropSeasons,
  MandiCategories,
  NotificationTypes,
};
