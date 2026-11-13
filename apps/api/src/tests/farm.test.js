import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
describe("Farm Management APIs & User Ownership", () => {
  let user1Token;
  let user2Token;
  beforeEach(async () => {
    const u1 = await request(app).post("/api/v1/auth/register").send({
      name: "Farmer One",
      email: "farmer1@example.com",
      password: "Password@123"
    });
    user1Token = u1.body.data.tokens.accessToken;
    const u2 = await request(app).post("/api/v1/auth/register").send({
      name: "Farmer Two",
      email: "farmer2@example.com",
      password: "Password@123"
    });
    user2Token = u2.body.data.tokens.accessToken;
  });
  const validFarmData = {
    name: "Nashik Green Orchard",
    state: "Maharashtra",
    district: "Nashik",
    village: "Lasalgaon",
    area: 4.5,
    areaUnit: "Acres",
    soilType: "Black",
    soilPh: 6.8,
    nitrogen: 85,
    phosphorus: 45,
    potassium: 40,
    irrigationMethod: "Drip",
    waterAvailability: "Moderate",
    currentCrops: ["Onion", "Tomato"],
    currentSeason: "Rabi"
  };
  it("should create a new farm profile for authenticated user", async () => {
    const res = await request(app).post("/api/v1/farms").set("Authorization", `Bearer ${user1Token}`).send(validFarmData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(validFarmData.name);
    expect(res.body.data.area).toBe(4.5);
  });
  it("should list farms belonging strictly to the authenticated user", async () => {
    await request(app).post("/api/v1/farms").set("Authorization", `Bearer ${user1Token}`).send(validFarmData);
    const resUser1 = await request(app).get("/api/v1/farms").set("Authorization", `Bearer ${user1Token}`);
    expect(resUser1.status).toBe(200);
    expect(resUser1.body.data.length).toBe(1);
    const resUser2 = await request(app).get("/api/v1/farms").set("Authorization", `Bearer ${user2Token}`);
    expect(resUser2.status).toBe(200);
    expect(resUser2.body.data.length).toBe(0);
  });
  it("should prevent cross-user access to another farmer's farm", async () => {
    const farmRes = await request(app).post("/api/v1/farms").set("Authorization", `Bearer ${user1Token}`).send(validFarmData);
    const farmId = farmRes.body.data.id;
    const res = await request(app).get(`/api/v1/farms/${farmId}`).set("Authorization", `Bearer ${user2Token}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("FARM_NOT_FOUND");
  });
  it("should update farm and delete farm cleanly", async () => {
    const farmRes = await request(app).post("/api/v1/farms").set("Authorization", `Bearer ${user1Token}`).send(validFarmData);
    const farmId = farmRes.body.data.id;
    const updateRes = await request(app).put(`/api/v1/farms/${farmId}`).set("Authorization", `Bearer ${user1Token}`).send({ ...validFarmData, area: 6 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.area).toBe(6);
    const delRes = await request(app).delete(`/api/v1/farms/${farmId}`).set("Authorization", `Bearer ${user1Token}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
  });
});
