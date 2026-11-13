# AgroSmart AI — Security, Privacy & Compliance Architecture

## 1. Authentication & Session Management
- **Short-Lived Access Tokens**: Signed JWT access tokens with 15-minute expirations to limit exposure upon token leakage.
- **Refresh Token Rotation**: Refresh tokens are stored with expiry dates in the MongoDB User document. Each refresh operation revokes the old refresh token and issues a new pair.
- **Session Revocation**: Password changes or explicit logout actions immediately invalidate all active user sessions across devices.
- **Password Hashing**: Bcrypt with 12 salt rounds protecting user credentials against dictionary attacks.
- **Role-Based Access Control (RBAC)**: All administrative endpoints (`/api/v1/admin/*`) require verified `admin` role claims verified at the server middleware layer.

---

## 2. Input Validation & Injection Prevention
- **Schema Validation**: All incoming requests (auth, farm creation, crop inputs, assistant chats) are validated using strict Zod schemas. Extraneous or malformed properties are stripped or rejected.
- **NoSQL Injection Defense**: All MongoDB queries utilize typed Mongoose schema bindings. User-supplied parameters are never passed directly as raw query objects.
- **File Upload Protection**:
  - Whitelist of approved MIME types (`image/jpeg`, `image/png`, `image/webp`).
  - Size limitation capped at 10MB (`MAX_FILE_SIZE_BYTES`).
  - Generated unique UUID storage filenames prevent directory traversal attacks (`../../`).
  - Verification of actual image bytes via Pillow before processing in the ML service.

---

## 3. Network & Transport Security
- **Security Headers**: Integrated Helmet middleware setting `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Content-Security-Policy`.
- **CORS Protection**: Strict cross-origin resource sharing configured to allow only authorized frontend origins (`CLIENT_ORIGIN`).
- **Audit Trails**: Security-sensitive administrative operations (such as role modifications) are logged with timestamp, administrator email, IP address, and user-agent.

---

## 4. Farmer Data Privacy
- **Strict Data Isolation**: Users can only access, view, modify, or delete farms, prediction records, conversations, and images that match their authenticated `userId`.
- **Minimal Data Collection**: Only agricultural plot parameters essential for crop science and meteorological lookups are requested.
