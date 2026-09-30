import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// POST /api/suitability - Dynamic Multi-Criteria Re-weighting
router.post('/', (req: Request, res: Response) => {
  const {
    population = 0.30,
    gap = 0.25,
    road = 0.15,
    transit = 0.15,
    land = 0.15,
  } = req.body || {};

  // Validate non-negative numbers
  const weights = {
    population: Math.max(0, Number(population)),
    gap: Math.max(0, Number(gap)),
    road: Math.max(0, Number(road)),
    transit: Math.max(0, Number(transit)),
    land: Math.max(0, Number(land)),
  };

  const rankedSites = dbStore.recalculateSuitability(weights);

  res.json({
    success: true,
    weights_applied: weights,
    top_recommendation: rankedSites[0],
    data: rankedSites,
  });
});

export default router;
