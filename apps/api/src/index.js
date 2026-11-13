import bcrypt from "bcryptjs";
import { app } from "./app.js";
import { ENV } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { User } from "./models/User.js";
async function bootstrap() {
  try {
    console.log("Starting AgroSmart AI backend server...");
    await connectDatabase();
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash("Admin@AgroSmart2026", 12);
      await User.create({
        name: "AgroSmart System Administrator",
        email: "admin@agrosmart.ai",
        passwordHash: adminPasswordHash,
        role: "admin",
        isVerified: true,
        state: "Maharashtra",
        district: "Pune"
      });
      console.log("Default admin seeded: admin@agrosmart.ai / Admin@AgroSmart2026");
    }
    const server = app.listen(ENV.PORT, () => {
      console.log(`AgroSmart AI API running on http://localhost:${ENV.PORT}`);
      console.log(`API documentation available at http://localhost:${ENV.PORT}/docs`);
      console.log(`Health check at http://localhost:${ENV.PORT}${ENV.API_PREFIX}/health`);
    });
    const handleShutdown = async (signal) => {
      console.log(`
Received ${signal}. Gracefully shutting down AgroSmart API...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log("Database disconnected. Process exiting.");
        process.exit(0);
      });
    };
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    console.error("Fatal initialization error:", error);
    process.exit(1);
  }
}
bootstrap();
