import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { User } from "./models/User.js";
import { Farm } from "./models/Farm.js";
async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDatabase();
    const adminEmail = "admin@agrosmart.ai";
    let admin = await User.findOne({ email: adminEmail });
    const adminPasswordHash = await bcrypt.hash("Admin@AgroSmart2026", 12);
    if (!admin) {
      admin = await User.create({
        name: "AgroSmart System Administrator",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        phone: "+91 9876543210",
        role: "admin",
        isVerified: true,
        state: "Maharashtra",
        district: "Pune"
      });
      console.log("\u2705 Created Admin user:", adminEmail);
    } else {
      admin.passwordHash = adminPasswordHash;
      admin.role = "admin";
      admin.isVerified = true;
      await admin.save();
      console.log("\u2705 Updated existing Admin user:", adminEmail);
    }
    const farmerEmail = "farmer@agrosmart.ai";
    let farmer = await User.findOne({ email: farmerEmail });
    const farmerPasswordHash = await bcrypt.hash("Farmer@AgroSmart2026", 12);
    if (!farmer) {
      farmer = await User.create({
        name: "Ramesh Kumar",
        email: farmerEmail,
        passwordHash: farmerPasswordHash,
        phone: "+91 9123456789",
        role: "farmer",
        isVerified: true,
        preferredLanguage: "hi",
        state: "Punjab",
        district: "Ludhiana"
      });
      console.log("\u2705 Created Farmer user:", farmerEmail);
    } else {
      farmer.passwordHash = farmerPasswordHash;
      farmer.role = "farmer";
      farmer.isVerified = true;
      await farmer.save();
      console.log("\u2705 Updated existing Farmer user:", farmerEmail);
    }
    const existingFarm = await Farm.findOne({ userId: farmer._id });
    if (!existingFarm) {
      await Farm.create({
        userId: farmer._id,
        name: "Green Valley Farm",
        state: "Punjab",
        district: "Ludhiana",
        village: "Khanna",
        area: 5,
        areaUnit: "Acres",
        soilType: "Alluvial",
        soilPh: 6.8,
        nitrogen: 180,
        phosphorus: 55,
        potassium: 140,
        irrigationMethod: "Drip",
        waterAvailability: "Abundant",
        currentCrops: ["Wheat", "Rice"],
        currentSeason: "Rabi",
        notes: "Primary family farm with fertile alluvial soil and drip irrigation."
      });
      console.log("\u2705 Created sample Farm entry for farmer:", farmer.name);
    } else {
      console.log("\u2139\uFE0F Farm profile already exists for farmer:", existingFarm.name);
    }
    console.log("\n--- SEED SUMMARY ---");
    console.log("Admin:");
    console.log("  Email:    admin@agrosmart.ai");
    console.log("  Password: Admin@AgroSmart2026");
    console.log("  Role:     admin");
    console.log("\nFarmer:");
    console.log("  Email:    farmer@agrosmart.ai");
    console.log("  Password: Farmer@AgroSmart2026");
    console.log("  Role:     farmer");
    console.log("--------------------\n");
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    console.error("\u274C Seeding failed:", err);
    await disconnectDatabase();
    process.exit(1);
  }
}
seed();
