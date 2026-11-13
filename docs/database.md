# AgroSmart AI — Database Schema & Data Models

## 1. Database Architecture
AgroSmart AI utilizes MongoDB with Mongoose ODM. In development and testing, an embedded in-memory MongoDB instance automatically provisions if no external MongoDB URI is supplied, ensuring immediate local execution.

## 2. Collections & Schema Definitions

### Users (`User`)
- `name`: String (Required, trimmed, max 100)
- `email`: String (Required, unique, lowercase, indexed)
- `passwordHash`: String (Bcrypt salt rounds: 12)
- `phone`: String (Optional)
- `role`: Enum `['farmer', 'admin']` (Indexed, default: 'farmer')
- `state`: String
- `district`: String
- `preferredLanguage`: String (Default: 'en')
- `refreshTokens`: Array of `{ token, expiresAt, createdAt }`
- **Indexes**: `{ email: 1 }` (unique), `{ role: 1 }`

### Farms (`Farm`)
- `userId`: ObjectId -> User (Required, indexed)
- `name`: String (Required, trimmed)
- `state`: String (Required, indexed)
- `district`: String (Required, indexed)
- `village`: String
- `area`: Number (Required, min: 0.01)
- `areaUnit`: Enum `['Acres', 'Hectares', 'Bigha', 'Guntha']`
- `soilType`: Enum `['Alluvial', 'Black', 'Red', 'Laterite', 'Clay', 'Loamy', ...]`
- `soilPh`: Number (3.0 to 10.0)
- `nitrogen`: Number (kg/ha)
- `phosphorus`: Number (kg/ha)
- `potassium`: Number (kg/ha)
- `irrigationMethod`: Enum `['Drip', 'Sprinkler', 'Flood/Surface', 'Canal', 'Rainfed', 'Tube Well']`
- `waterAvailability`: Enum `['Abundant', 'Moderate', 'Scarce', 'Seasonal Rainfed']`
- `currentCrops`: Array of Strings
- `currentSeason`: Enum `['Kharif', 'Rabi', 'Zaid', 'Perennial']`
- **Indexes**: `{ userId: 1, name: 1 }`, `{ state: 1, district: 1 }`

### Crop Recommendations (`CropRecommendation`)
- `userId`: ObjectId -> User (Required, indexed)
- `farmId`: ObjectId -> Farm (Optional, indexed)
- `farmName`: String
- `input`: Object `{ nitrogen, phosphorus, potassium, soilPh, temperature, humidity, rainfall, season }`
- `result`: Object `{ primaryCrop, confidence, rationale, growingSeason, waterRequirements, alternatives, agronomicAdvice, modelMetadata }`
- **Indexes**: `{ userId: 1, createdAt: -1 }`

### Plant Disease Diagnoses (`DiseaseDiagnosis`)
- `userId`: ObjectId -> User (Required, indexed)
- `cropName`: String
- `imageUrl`: String
- `imageStorageKey`: String
- `result`: Object `{ prediction: { diseaseName, scientificName, crop, isHealthy, severity, symptoms, cause, organicTreatment, chemicalTreatment }, topMatches, modelMetadata }`
- `userNotes`: String
- **Indexes**: `{ userId: 1, createdAt: -1 }`

### Conversations & Messages (`Conversation`)
- `userId`: ObjectId -> User (Required, indexed)
- `title`: String
- `farmId`: ObjectId -> Farm
- `messages`: Array of `{ id, role: ['user', 'assistant'], content, farmContextUsed, timestamp }`
- **Indexes**: `{ userId: 1, updatedAt: -1 }`

### Notifications (`Notification`)
- `userId`: ObjectId -> User (Required, indexed)
- `type`: Enum `['weather_alert', 'pest_warning', 'market_price_alert', 'farm_reminder', 'system']`
- `title`: String
- `message`: String
- `link`: String
- `isRead`: Boolean (Default: false, indexed)
- **Indexes**: `{ userId: 1, isRead: 1, createdAt: -1 }`

### Market Favorites (`MarketFavorite`)
- `userId`: ObjectId -> User (Required, indexed)
- `state`: String
- `market`: String
- `commodity`: String
- **Compound Unique Index**: `{ userId: 1, market: 1, commodity: 1 }`

### Audit Logs (`AuditLog`)
- `adminId`: ObjectId -> User (Required, indexed)
- `adminEmail`: String
- `action`: String (e.g. 'UPDATE_USER_ROLE')
- `targetType`: String
- `targetId`: String
- `details`: Mixed
- `ipAddress`: String
- `userAgent`: String
- `createdAt`: Date (Indexed)
- **Indexes**: `{ createdAt: -1 }`, `{ adminId: 1 }`
