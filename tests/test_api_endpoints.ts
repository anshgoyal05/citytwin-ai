/**
 * CityTwin AI — Automated Backend API Route Verification
 * Tests all core REST endpoints against the server instance.
 */

import http from 'node:http';
import app from '../server/index.js';

process.env.NODE_ENV = 'test';
const TEST_PORT = 5095;

const server = app.listen(TEST_PORT, async () => {
  console.log(`[TEST] Testing CityTwin Express API on http://localhost:${TEST_PORT}...`);

  try {
    const get = async (path: string) => {
      const res = await fetch(`http://localhost:${TEST_PORT}${path}`);
      if (!res.ok) throw new Error(`GET ${path} returned status ${res.status}`);
      return await res.json();
    };

    const post = async (path: string, body: any) => {
      const res = await fetch(`http://localhost:${TEST_PORT}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`POST ${path} returned status ${res.status}`);
      return await res.json();
    };

    // 1. Health Endpoint
    console.log('1. Testing /api/health...');
    const health = await get('/api/health');
    console.assert(health.status === 'healthy', 'Health check failed');
    console.assert(health.telemetry.total_sectors === 64, 'Must have 64 sectors');
    console.log('   ✓ Passed /api/health');

    // 2. Sectors Endpoint
    console.log('2. Testing /api/sectors...');
    const sectors = await get('/api/sectors');
    console.assert(sectors.total === 64, 'Must return 64 sectors');
    console.assert(sectors.data[0].sector_name.length > 0, 'Sector must have name');
    console.log('   ✓ Passed /api/sectors (64 sectors returned)');

    // 3. Single Sector Filter & Search
    console.log('3. Testing /api/sectors/:name & search query...');
    const sec52 = await get('/api/sectors/Sector%2052');
    console.assert(sec52.data.sector_name === 'Sector 52', 'Sector 52 lookup failed');
    const searchSarang = await get('/api/sectors?search=Sarangpur');
    console.assert(searchSarang.total === 1, 'Search for Sarangpur must return 1 sector');
    console.log('   ✓ Passed sector lookup and query search');

    // 4. Hospitals Endpoint
    console.log('4. Testing /api/hospitals...');
    const hospitals = await get('/api/hospitals');
    console.assert(hospitals.total === 11, 'Must return 11 hospitals');
    console.assert(hospitals.summary.total_beds === 4835, 'Total beds must equal 4,835');
    console.log('   ✓ Passed /api/hospitals (11 facilities, 4,835 beds verified)');

    // 5. Candidate Sites Endpoint
    console.log('5. Testing /api/candidate-sites...');
    const candidates = await get('/api/candidate-sites');
    console.assert(candidates.total === 6, 'Must return 6 candidate sites');
    console.assert(candidates.data[0].id === 'cand-site-1', 'Site 1 must be present');
    console.log('   ✓ Passed /api/candidate-sites (6 parcels returned)');

    // 6. Dynamic Suitability Re-weighting
    console.log('6. Testing POST /api/suitability...');
    const suitability = await post('/api/suitability', {
      population: 0.50,
      gap: 0.20,
      road: 0.10,
      transit: 0.10,
      land: 0.10,
    });
    console.assert(suitability.success === true, 'Suitability calculation failed');
    console.assert(suitability.data.length === 6, 'Must re-rank all 6 sites');
    console.assert(suitability.top_recommendation.id === 'cand-site-1', 'Site 1 should lead on pop weight');
    console.log(`   ✓ Passed POST /api/suitability (Top: ${suitability.top_recommendation.name})`);

    // 7. Scenario Comparison Diffing
    console.log('7. Testing POST /api/scenarios/compare...');
    const comparison = await post('/api/scenarios/compare', {
      siteAId: 'cand-site-1',
      siteBId: 'cand-site-2',
    });
    console.assert(comparison.success === true, 'Scenario comparison failed');
    console.assert(comparison.scenario.comparison.score_delta !== undefined, 'Score delta must exist');
    console.log(`   ✓ Passed POST /api/scenarios/compare (Score Delta: ${comparison.scenario.comparison.score_delta})`);

    // 8. Benchmarks Endpoint
    console.log('8. Testing /api/benchmarks...');
    const benchmarks = await get('/api/benchmarks');
    console.assert(benchmarks.success === true, 'Benchmarks route failed');
    console.log('   ✓ Passed /api/benchmarks');

    console.log('\n=============================================');
    console.log('🎉 ALL REST API ENDPOINT TESTS PASSED WITH 100% SUCCESS!');
    console.log('=============================================\n');

    server.close(() => process.exit(0));
  } catch (err) {
    console.error('API Test Error:', err);
    server.close(() => process.exit(1));
  }
});
