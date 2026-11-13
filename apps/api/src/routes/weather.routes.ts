import { Router, Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weatherService.js';
import { Farm } from '../models/Farm.js';
import { optionalAuth } from '../middleware/auth.js';

export const weatherRouter = Router();

// Weather can be queried by public users or authenticated farmers
weatherRouter.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    const lon = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
    let city = req.query.city as string;
    const farmId = req.query.farmId as string;

    if (farmId && req.user) {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user.id });
      if (farm) {
        if (farm.latitude && farm.longitude) {
          const data = await WeatherService.getWeather({
            latitude: farm.latitude,
            longitude: farm.longitude,
            city: farm.district || farm.name,
          });
          res.json({ success: true, data });
          return;
        } else if (farm.district) {
          city = farm.district;
        }
      }
    }

    // If no explicit city or coordinates are given, check user profile location
    if (!city && !lat && !lon && req.user) {
      if ((req.user as any).district) {
        city = (req.user as any).district;
      } else if ((req.user as any).state) {
        city = (req.user as any).state;
      }
    }

    const data = await WeatherService.getWeather({
      latitude: lat,
      longitude: lon,
      city: city || 'Delhi',
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});
