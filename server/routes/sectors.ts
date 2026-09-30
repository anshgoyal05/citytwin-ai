import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// GET /api/sectors - List all 64 Chandigarh sectors
router.get('/', (req: Request, res: Response) => {
  const { zone, search } = req.query;
  let results = dbStore.getSectors();

  if (zone && typeof zone === 'string') {
    results = results.filter((s) => s.zone.toLowerCase() === zone.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.sector_name.toLowerCase().includes(q) ||
        s.land_use.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results,
  });
});

// GET /api/sectors/:name - Get individual sector
router.get('/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const sector = dbStore.getSectorByName(name);

  if (!sector) {
    return res.status(404).json({
      success: false,
      error: `Sector '${name}' not found in Chandigarh registry.`,
    });
  }

  res.json({
    success: true,
    data: sector,
  });
});

export default router;
