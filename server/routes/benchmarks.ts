import { Router, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const router = Router();

// GET /api/benchmarks - Retrieve benchmark summary
router.get('/', (req: Request, res: Response) => {
  const benchmarkFile = path.join(ROOT_DIR, 'reports', 'benchmarks', 'benchmark_summary.json');
  if (fs.existsSync(benchmarkFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(benchmarkFile, 'utf-8'));
      return res.json({
        success: true,
        data,
      });
    } catch {
      // Fallback
    }
  }

  // Fallback initial response if benchmarks haven't run yet
  res.json({
    success: true,
    data: {
      status: 'Ready',
      target_runs: 1000,
      description: 'Monte Carlo sensitivity and stability benchmark suite across random weight vectors.',
    },
  });
});

// GET /api/tests - Retrieve test results summary
router.get('/tests', (req: Request, res: Response) => {
  const testsFile = path.join(ROOT_DIR, 'reports', 'test_results.json');
  if (fs.existsSync(testsFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(testsFile, 'utf-8'));
      return res.json({
        success: true,
        data,
      });
    } catch {
      // Fallback
    }
  }

  res.json({
    success: true,
    data: {
      status: 'Ready',
      target_tests_per_component: 200,
      components: ['scoring_engine', 'ml_model', 'data_pipeline', 'api_routes'],
    },
  });
});

export default router;
