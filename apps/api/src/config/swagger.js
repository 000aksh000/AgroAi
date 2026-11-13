export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "AgroSmart AI RESTful API",
    version: "1.0.0",
    description: "Production-ready backend API documentation for AgroSmart AI platform \u2014 providing farmer profiles, crop recommendations, plant disease detection, weather forecasts, mandi prices, and AI advisory.",
    contact: {
      name: "AgroSmart AI Engineering Team",
      email: "support@agrosmart.ai"
    }
  },
  servers: [
    {
      url: "/api/v1",
      description: "Default API v1 Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "System health check",
        responses: {
          200: { description: "System status, database and ML service connectivity" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register a new farmer account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  phone: { type: "string" },
                  state: { type: "string" },
                  district: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User account created and tokens issued" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Authenticate with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login successful" }
        }
      }
    },
    "/farms": {
      get: {
        summary: "List farms for authenticated user",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of farms" } }
      },
      post: {
        summary: "Create a new farm",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Farm created" } }
      }
    },
    "/crops/recommend": {
      post: {
        summary: "Run AI crop recommendation inference",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Crop recommendation and agronomic rationale" } }
      }
    },
    "/diseases/detect": {
      post: {
        summary: "Upload leaf photo for plant disease detection",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Disease prediction, severity, and treatments" } }
      }
    },
    "/weather": {
      get: {
        summary: "Get live weather and agricultural advisory",
        responses: { 200: { description: "Live conditions, 7-day forecast, and spraying advisory" } }
      }
    },
    "/mandi/prices": {
      get: {
        summary: "Query APMC mandi market commodity prices",
        responses: { 200: { description: "Mandi price records and filters" } }
      }
    },
    "/assistant/chat": {
      post: {
        summary: "Chat with AI Agricultural Assistant",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Assistant answer" } }
      }
    }
  }
};
