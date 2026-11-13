import { Router } from "express";
import { WeatherService } from "../services/weatherService.js";
import { Farm } from "../models/Farm.js";
import { optionalAuth } from "../middleware/auth.js";
export const weatherRouter = Router();
weatherRouter.get("/", optionalAuth, async (req, res, next) => {
  try {
    const lat = req.query.latitude ? parseFloat(req.query.latitude) : void 0;
    const lon = req.query.longitude ? parseFloat(req.query.longitude) : void 0;
    let city = req.query.city;
    const farmId = req.query.farmId;
    if (farmId && req.user) {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user.id });
      if (farm) {
        if (farm.latitude && farm.longitude) {
          const data2 = await WeatherService.getWeather({
            latitude: farm.latitude,
            longitude: farm.longitude,
            city: farm.district || farm.name
          });
          res.json({ success: true, data: data2 });
          return;
        } else if (farm.district) {
          city = farm.district;
        }
      }
    }
    if (!city && !lat && !lon && req.user) {
      if (req.user.district) {
        city = req.user.district;
      } else if (req.user.state) {
        city = req.user.state;
      }
    }
    const data = await WeatherService.getWeather({
      latitude: lat,
      longitude: lon,
      city: city || "Delhi"
    });
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});
