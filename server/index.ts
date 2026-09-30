import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { dbStore } from './db.js';
import sectorsRouter from './routes/sectors.js';
import hospitalsRouter from './routes/hospitals.js';
import candidateSitesRouter from './routes/candidateSites.js';
import suitabilityRouter from './routes/suitability.js';
import scenariosRouter from './routes/scenarios.js';
import benchmarksRouter from './routes/benchmarks.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  // Non-intrusive logging
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${duration}ms`);
  }
});

// Health & System Telemetry
app.get('/api/health', (_req: Request, res: Response) => {
  const sectors = dbStore.getSectors();
  const hospitals = dbStore.getHospitals();
  const candidates = dbStore.getCandidateSites();

  res.json({
    status: 'healthy',
    system: 'CityTwin AI Backend Decision-Support API',
    city: 'Chandigarh, India (UT 04)',
    storage_mode: dbStore.getMode(),
    timestamp: new Date().toISOString(),
    telemetry: {
      total_sectors: sectors.length,
      total_hospitals: hospitals.length,
      total_candidate_parcels: candidates.length,
      coordinate_bounds: {
        latitude: [30.6800, 30.7950],
        longitude: [76.7000, 76.8550],
        crs: 'EPSG:4326',
      },
    },
  });
});

// Mount Routes
app.use('/api/sectors', sectorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/candidate-sites', candidateSitesRouter);
app.use('/api/suitability', suitabilityRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/benchmarks', benchmarksRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found. See documentation at /api/health.',
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start Server if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 CityTwin AI Backend listening on http://localhost:${PORT}`);
    console.log(`📡 Storage Mode: [${dbStore.getMode()}] | Sectors: ${dbStore.getSectors().length} | Hospitals: ${dbStore.getHospitals().length}`);
  });
}

export default app;
