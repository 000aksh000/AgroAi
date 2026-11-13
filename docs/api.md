# AgroSmart AI — REST API Documentation

Base URL: `/api/v1`  
Swagger UI: `http://localhost:5000/docs`

## 1. Authentication Endpoints

### Register Farmer
- **Method**: `POST /auth/register`
- **Body**:
  ```json
  {
    "name": "Ramesh Patel",
    "email": "ramesh@example.com",
    "password": "Password@123",
    "phone": "+919876543210",
    "state": "Maharashtra",
    "district": "Nashik"
  }
  ```
- **Response**: `201 Created` with user object and JWT tokens.

### Login
- **Method**: `POST /auth/login`
- **Body**: `{ "email": "ramesh@example.com", "password": "Password@123" }`
- **Response**: `200 OK` with accessToken and sets HttpOnly refreshToken cookie.

### Refresh Token
- **Method**: `POST /auth/refresh`
- **Body**: `{ "refreshToken": "..." }` (or via cookie)
- **Response**: `200 OK` with new accessToken and rotated refreshToken.

### Get Current Profile
- **Method**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `200 OK` with current user profile.

---

## 2. Farm Management Endpoints
- `GET /farms` — List farms belonging to authenticated user.
- `POST /farms` — Create new farm plot with soil N-P-K, pH, area, irrigation.
- `GET /farms/:id` — Retrieve farm details (enforces user ownership).
- `PUT /farms/:id` — Update farm details (enforces user ownership).
- `DELETE /farms/:id` — Delete farm plot.

---

## 3. AI Crop Recommendation Endpoints
- `POST /crops/recommend` — Run ML model inference with soil & climate parameters.
  ```json
  {
    "farmId": "optional-farm-id",
    "nitrogen": 80,
    "phosphorus": 45,
    "potassium": 40,
    "soilPh": 6.5,
    "temperature": 25,
    "humidity": 75,
    "rainfall": 180,
    "state": "Maharashtra",
    "district": "Nashik",
    "season": "Kharif"
  }
  ```
- `GET /crops/history` — Paginated history of past recommendations.
- `GET /crops/:id` — Details of specific recommendation.
- `DELETE /crops/:id` — Delete recommendation.

---

## 4. Plant Disease Detection Endpoints
- `POST /diseases/detect` — Multipart form upload (`image` file, `cropName`, `userNotes`).
- `GET /diseases/history` — Paginated diagnosis history.
- `GET /diseases/:id` — Single diagnosis report with symptoms and treatment options.
- `DELETE /diseases/:id` — Delete diagnosis record.

---

## 5. Weather & Mandi Endpoints
- `GET /weather` — Hyperlocal live conditions, 7-day forecast, and spraying advisory. Parameters: `city`, `latitude`, `longitude`, `farmId`.
- `GET /mandi/prices` — Daily APMC mandi commodity prices. Parameters: `state`, `district`, `market`, `commodity`, `search`, `page`, `limit`.
- `GET /mandi/trend` — 7-day modal price trend series. Parameters: `commodity`, `basePrice`.
- `GET /mandi/favorites` — Authenticated user's saved favorite markets.
- `POST /mandi/favorites` — Save a market/commodity to favorites.
- `DELETE /mandi/favorites/:id` — Remove from favorites.

---

## 6. Kisan AI Assistant Endpoints
- `POST /assistant/chat` — Send query to assistant with optional conversation ID and farm context.
- `GET /assistant/conversations` — List user's consultation threads.
- `GET /assistant/conversations/:id` — Message history of a consultation thread.
- `DELETE /assistant/conversations/:id` — Delete consultation thread.

---

## 7. Administrative Endpoints (Admin Role Required)
- `GET /admin/users` — Search and paginate user accounts.
- `PATCH /admin/users/:id/role` — Update user role (`farmer` <-> `admin`).
- `GET /admin/analytics` — Platform statistics (users, farms, predictions, scans).
- `GET /admin/system-health` — Real-time memory, uptime, and ML service model status.
- `GET /admin/audit-logs` — Administrative audit log records.
