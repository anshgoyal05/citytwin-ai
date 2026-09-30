import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// GET /api/hospitals - List all 11 hospitals
router.get('/', (req: Request, res: Response) => {
  const { emergencyOnly } = req.query;
  let hospitals = dbStore.getHospitals();

  if (emergencyOnly === 'true') {
    hospitals = hospitals.filter((h) => h.emergency);
  }

  const totalBeds = hospitals.reduce((sum, h) => sum + h.beds, 0);
  const totalIcu = hospitals.reduce((sum, h) => sum + h.icu_beds, 0);
  const totalDailyOpd = hospitals.reduce((sum, h) => sum + h.daily_opd, 0);

  res.json({
    success: true,
    total: hospitals.length,
    summary: {
      total_beds: totalBeds,
      total_icu_beds: totalIcu,
      total_daily_opd: totalDailyOpd,
    },
    data: hospitals,
  });
});

// GET /api/hospitals/:id - Get individual hospital
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const hospital = dbStore.getHospitalById(id);

  if (!hospital) {
    return res.status(404).json({
      success: false,
      error: `Hospital '${id}' not found.`,
    });
  }

  res.json({
    success: true,
    data: hospital,
  });
});

export default router;
