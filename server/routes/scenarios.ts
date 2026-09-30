import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// POST /api/scenarios/compare - Detailed Side-by-Side Trade-off Diffing
router.post('/compare', (req: Request, res: Response) => {
  const { siteAId, siteBId } = req.body || {};

  if (!siteAId || !siteBId) {
    return res.status(400).json({
      success: false,
      error: 'Both siteAId and siteBId parameters are required for scenario comparison.',
    });
  }

  const siteA = dbStore.getCandidateSiteById(siteAId);
  const siteB = dbStore.getCandidateSiteById(siteBId);

  if (!siteA || !siteB) {
    return res.status(404).json({
      success: false,
      error: 'One or both specified candidate sites could not be found.',
    });
  }

  // Calculate quantitative deltas
  const popDelta = siteA.population_within_2km - siteB.population_within_2km;
  const costDelta = siteA.estimated_cost_cr - siteB.estimated_cost_cr;
  const scoreDelta = Number((siteA.suitability_score - siteB.suitability_score).toFixed(1));
  const landDelta = Number((siteA.vacant_land_acres - siteB.vacant_land_acres).toFixed(1));
  const gapDelta = Number((siteA.distance_to_nearest_hospital_km - siteB.distance_to_nearest_hospital_km).toFixed(1));

  let preferredWinner = 'Neutral / Tie';
  let synthesis = '';

  if (scoreDelta > 3.0) {
    preferredWinner = siteA.name;
    synthesis = `${siteA.name} demonstrates a superior composite score (+${scoreDelta} pts), reaching ${Math.abs(popDelta).toLocaleString()} more residents within 2km, making it the more urgent clinical investment despite cost differentials.`;
  } else if (scoreDelta < -3.0) {
    preferredWinner = siteB.name;
    synthesis = `${siteB.name} demonstrates a superior composite score (+${Math.abs(scoreDelta)} pts), with stronger strategic advantages for municipal infrastructure expansion.`;
  } else {
    preferredWinner = 'Close Call / Trade-off Dependent';
    synthesis = `Scores are within a statistical dead-heat (+${scoreDelta} pts). Prioritize ${siteA.name} for immediate acute population relief, or ${siteB.name} for larger campus land scaling.`;
  }

  res.json({
    success: true,
    scenario: {
      site_a: siteA,
      site_b: siteB,
      comparison: {
        score_delta: scoreDelta,
        population_catchment_delta: popDelta,
        capital_outlay_delta_cr: costDelta,
        land_acres_delta: landDelta,
        distance_gap_delta_km: gapDelta,
        preferred_winner: preferredWinner,
        synthesis,
      },
    },
  });
});

export default router;
