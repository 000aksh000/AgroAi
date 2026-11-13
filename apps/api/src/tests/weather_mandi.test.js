import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";
describe("Weather & Mandi Market APIs", () => {
  it("should fetch weather data with agricultural spraying and irrigation advisory", async () => {
    const res = await request(app).get("/api/v1/weather?city=Pune");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.current.temperature).toBeDefined();
    expect(res.body.data.forecast.length).toBeGreaterThan(0);
    expect(res.body.data.agriAdvisory.sprayingCondition).toBeDefined();
    expect(res.body.data.agriAdvisory.irrigationNeed).toBeDefined();
  });
  it("should fetch mandi prices across Indian agricultural states", async () => {
    const res = await request(app).get("/api/v1/mandi/prices?state=Maharashtra");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].state).toBe("Maharashtra");
    expect(res.body.data[0].modalPrice).toBeGreaterThan(0);
  });
  it("should filter mandi commodities by name search", async () => {
    const res = await request(app).get("/api/v1/mandi/prices?search=Onion");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].commodity).toBe("Onion");
  });
  it("should return 7-day price trend series for chart visualization", async () => {
    const res = await request(app).get("/api/v1/mandi/trend?commodity=Wheat&basePrice=2400");
    expect(res.status).toBe(200);
    expect(res.body.data.commodity).toBe("Wheat");
    expect(res.body.data.trend.length).toBe(7);
    expect(res.body.data.trend[0].modalPrice).toBeGreaterThan(0);
  });
});
