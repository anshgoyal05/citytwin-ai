import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// GET /api/candidate-sites - List all 6 candidate hospital sites
router.get('/', (req: Request, res: Response) => {
  const sites = dbStore.getCandidateSites();

  res.json({
    success: true,
    total: sites.length,
    data: sites,
  });
});

// GET /api/candidate-sites/:id - Get individual candidate parcel
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const site = dbStore.getCandidateSiteById(id);

  if (!site) {
    return res.status(404).json({
      success: false,
      error: `Candidate site '${id}' not found.`,
    });
  }

  res.json({
    success: true,
    data: site,
  });
});

export default router;
