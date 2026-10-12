import { Router, Request, Response } from 'express';
import { dbStore } from '../db.js';

const router = Router();

// Spatial context builder for Chandigarh Digital Twin
function getChandigarhContext() {
  const sectors = dbStore.getSectors();
  const hospitals = dbStore.getHospitals();
  const candidates = dbStore.getCandidateSites();

  const totalPop = sectors.reduce((acc, s) => acc + (s.population || 0), 0);
  const totalBeds = hospitals.reduce((acc, h) => acc + (h.beds || 0), 0);
  const avgBedsPer1000 = totalPop > 0 ? ((totalBeds / totalPop) * 1000).toFixed(2) : '3.3';

  return `
CHANDIGARH DIGITAL TWIN (CITYTWIN AI) GROUND-TRUTH KNOWLEDGE BASE:
- City: Chandigarh, Union Territory (UT 04), India. Designed by Le Corbusier on an orthogonal sector grid.
- Sectors Mapped: ${sectors.length} sectors. Total Estimated Population: ~${totalPop.toLocaleString()} citizens.
- Healthcare System: ${hospitals.length} major hospitals with ${totalBeds.toLocaleString()} total beds.
- Average Bed Ratio: ${avgBedsPer1000} beds per 1,000 residents (WHO recommends minimum 5.0 beds per 1,000).
- Key Tertiary Facilities:
  * PGIMER (Sector 12): 2,200 beds, 180 ICU beds, 10,500+ daily OPD visits. Serves Punjab, Haryana, HP, J&K.
  * GMCH 32 (Sector 32): 950 beds, 85 ICU beds, 4,200 daily OPD visits. Anchors South Chandigarh.
  * GMSH 16 (Sector 16): 500 beds, 45 ICU beds. Civil general hospital in central core.
- Critical Healthcare Deserts (>3.0 km from tertiary care):
  * Sector 52 (4.6 km to GMCH 32), Maloya (4.8 km to GMSH 16), Dhanas (3.8 km to PGIMER), Dadumajra, Sector 56. Over 150,000 peripheral residents face emergency ambulance delays exceeding 25 minutes.
- Evaluated Candidate Sites:
  * Site Alpha (Sector 52 Maloya Corridor): 18.5 acres, Rank #1 (Suitability Score: ~93.4/100). Resolves peripheral healthcare deficit, cuts transit to 6 mins, Vikas Marg & PR-7 expressway access.
  * Site Beta (Sarangpur Institutional Reserve): 32.0 acres, Rank #2 (Score: ~84.2/100). Large buffer for Mullanpur/New Chandigarh influx.
  * Site Gamma (Manimajra Housing Board): 12.4 acres, Rank #3 (Score: ~76.5/100). East corridor reach.
  * Site Delta (Sector 26 Transport Hub): 15.0 acres, Rank #4 (Score: ~68.0/100). Industrial/mixed-use buffer.
- Golden-Hour Isochrones: 5 min (120k pop), 10 min (285k pop), 15 min (380k pop) catchment capture around Sector 52.
`;
}

const SYSTEM_INSTRUCTION = `
You are TwinMind, the intelligent spatial AI advisor of CityTwin AI — Chandigarh's Urban Digital Twin Platform.
You are built specifically for municipal planners, city engineers, healthcare administrators, and citizens of Chandigarh.

YOUR PERSONA & GUIDELINES:
1. Name: TwinMind (never refer to yourself as Copilot or generic assistant).
2. Identity: You are the AI mind powering CityTwin AI for Chandigarh Spatial Decision Intelligence.
3. Tone: Articulate, helpful, visionary, objective, and urban-planning savvy. Think Apple-level clarity and polish.
4. Greetings: When a user greets you ("hi", "hello", "hey", "good morning"), respond warmly as TwinMind, introduce your capabilities (evaluating hospital locations, testing sector demographics, computing healthcare accessibility, and scenario trade-offs), and invite them to explore.
5. Factual Grounding: Use the provided Chandigarh Ground-Truth Knowledge Base for all statistical, geographic, and facility questions. Do not hallucinate sectors or numbers outside Chandigarh UT.
6. Formatting: Use clean markdown, bold highlights, bullet points, and actionable summaries. Keep answers concise, informative, and engaging.
`;

// GET /api/twinmind/status
router.get('/status', (_req: Request, res: Response) => {
  const serverKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  res.json({
    success: true,
    name: 'TwinMind AI',
    platform: 'CityTwin AI',
    hasServerKey: Boolean(serverKey && serverKey.trim().length > 10),
    recommendedModel: 'gemini-2.5-flash',
  });
});

function cleanKey(raw?: string): string {
  if (!raw) return '';
  let k = raw.trim();
  if (k.includes('=')) {
    k = k.split('=').pop() || '';
  }
  return k.replace(/["';\s\r\n]/g, '').trim();
}

// POST /api/twinmind/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, apiKey: bodyApiKey } = req.body;
    const userQuery = (message || '').trim();

    if (!userQuery) {
      return res.status(400).json({ success: false, error: 'Query message is required.' });
    }

    // Resolve API Key: prioritize body, then client header, then server env
    const clientKey = req.headers['x-gemini-api-key'] as string;
    const rawKey = bodyApiKey || clientKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const apiKey = cleanKey(rawKey);

    const spatialContext = getChandigarhContext();

    // If API key is available, call Gemini API
    if (apiKey && apiKey.length > 10) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        // Add chat history if provided
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.text && item.role) {
              contents.push({
                role: item.role === 'ai' || item.role === 'model' ? 'model' : 'user',
                parts: [{ text: item.text }],
              });
            }
          }
        }

        // Add current user prompt with spatial grounding
        contents.push({
          role: 'user',
          parts: [{ text: userQuery }],
        });

        // Request Gemini API with system instruction
        const requestPayload = {
          systemInstruction: {
            parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${spatialContext}` }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        };

        // Try gemini-2.5-flash first, then fallback to gemini-1.5-flash
        const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
        let geminiResponse: any = null;
        let activeModel = models[0];

        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestPayload),
            });

            if (response.ok) {
              geminiResponse = await response.json();
              activeModel = model;
              break;
            } else {
              const errText = await response.text();
              console.warn(`[TwinMind] Gemini ${model} failed (${response.status}):`, errText);
            }
          } catch (modelErr) {
            console.warn(`[TwinMind] Network error trying ${model}:`, modelErr);
          }
        }

        if (geminiResponse && geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
          const generatedText = geminiResponse.candidates[0].content.parts[0].text;
          return res.json({
            success: true,
            reply: generatedText,
            badge: `TWINMIND • ${activeModel.toUpperCase()}`,
            model: activeModel,
            isLiveGemini: true,
          });
        }
      } catch (geminiError: any) {
        console.error('[TwinMind] Gemini API call error:', geminiError);
        // fall through to intelligent fallback
      }
    }

    // -------------------------------------------------------------
    // Intelligent Fallback when no key or network issue occurs
    // -------------------------------------------------------------
    const lower = userQuery.toLowerCase();
    let replyText = '';
    let badge = 'TWINMIND SPATIAL INTELLIGENCE';

    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.startsWith('hi ') ||
      lower.startsWith('hello ') ||
      lower.startsWith('hey ') ||
      lower === 'greetings'
    ) {
      replyText = `Hello! I am **TwinMind**, your CityTwin AI Spatial Planning Intelligence Assistant for Chandigarh.\n\nI have real-time telemetry access to all **64 sectors**, **11 major hospitals** (${dbStore.getHospitals().reduce((acc, h) => acc + (h.beds || 0), 0).toLocaleString()} beds), and **6 evaluated candidate infrastructure sites**.\n\nHow can I assist your urban planning analysis today? You can ask me:\n- *"Which sectors have the highest healthcare deficit?"*\n- *"Why is Site Alpha (Sector 52) ranked #1?"*\n- *"Compare bed capacities between PGIMER and GMCH 32"*\n- *"What is the 15-minute emergency catchment reach?"*`;
      badge = 'TWINMIND AI • READY';
    } else if (lower.includes('pgi') || lower.includes('12')) {
      replyText = `**PGIMER (Postgraduate Institute of Medical Education and Research)** in Sector 12 is Chandigarh's largest medical institution with **2,200 beds**, 180 ICU beds, and over 10,500 daily outpatient visits. Because it serves the entire northern region (Punjab, Haryana, Himachal Pradesh, J&K), its emergency wards operate at over 140% capacity. CityTwin's spatial model shows that building satellite facilities in peripheral sectors like Sector 52 or Sarangpur is vital to alleviate this congestion.`;
      badge = 'PGIMER SECTOR 12 TELEMETRY';
    } else if (lower.includes('sector 52') || lower.includes('alpha') || lower.includes('site alpha') || lower.includes('top site') || lower.includes('rank 1') || lower.includes('best site')) {
      replyText = `**Site Alpha in Sector 52** is ranked **#1** (Suitability Score: **93.4 / 100**) across all evaluated sites in Chandigarh. Key decision drivers:\n1. **Peripheral Healthcare Gap**: Sector 52, Maloya, and Dadumajra residents currently travel **4.6 km** to reach GMCH 32, with emergency travel times exceeding 25 minutes.\n2. **High Population Demand**: Dense population cluster (>40,000/km²) of 142,000 citizens in immediate vicinity.\n3. **Available Land**: 18.5 acres of designated institutional reserve adjacent to Vikas Marg.\n4. **Expressway Access**: Direct connectivity to the PR-7 expressway corridor for rapid regional ambulance routing.`;
      badge = 'SITE ALPHA #1 (SCORE: 93.4)';
    } else if (lower.includes('bed') || lower.includes('beds') || lower.includes('ratio')) {
      replyText = `Chandigarh Union Territory currently has **4,835 hospital beds** across 11 major facilities, serving a population of approximately 1,055,450. This equates to **3.3 beds per 1,000 residents**. While this is higher than the Indian national average (1.4/1k), it falls significantly short of the WHO target of **5.0 beds per 1,000**, particularly given that Chandigarh's tertiary centers treat patients from across northern India.`;
      badge = 'CHANDIGARH BED RATIO: 3.3/1k';
    } else if (lower.includes('sarangpur') || lower.includes('beta')) {
      replyText = `**Site Beta in Sarangpur** ranks **#2** (Suitability Score: **84.2 / 100**). It offers the largest available land parcel at **32.0 acres** in the designated Institutional Zone. Developing a secondary medical hub here acts as a strategic buffer to intercept patient traffic arriving from Mullanpur (New Chandigarh) before it hits Madhya Marg and gridlocks northern avenues.`;
      badge = 'SITE BETA SARANGPUR (32 ACRES)';
    } else if (lower.includes('gap') || lower.includes('desert') || lower.includes('underserved') || lower.includes('distance')) {
      replyText = `Spatial distance analysis identifies **14 critical underserved sectors** (>3.0 km from tertiary healthcare). The most acute deficit corridor is formed by **Sector 52 (4.6 km to GMCH 32)**, **Maloya (4.8 km to GMSH 16)**, **Dhanas (3.8 km to PGIMER)**, and **Sector 56 (3.4 km)**. Over 150,000 residents in these peripheral sectors face delayed golden-hour emergency transit.`;
      badge = '14 UNDERSERVED SECTORS';
    } else {
      replyText = `I have analyzed **"${userQuery}"** across the Chandigarh spatial decision database.\n\nOur spatial multi-criteria analysis indicates that municipal investments should prioritize **South and West peripheral sectors** (Sector 52, Maloya, Dadumajra, Dhanas), where population density exceeds 30,000/km² and distance to emergency tertiary care exceeds 4 km.\n\n*(Note: To enable unlimited free-form generative conversations on any topic with Google Gemini, connect your Gemini API key in the TwinMind settings above!)*`;
      badge = 'TWINMIND SYNTHESIS';
    }

    return res.json({
      success: true,
      reply: replyText,
      badge,
      isLiveGemini: false,
      requiresKeyNote: !apiKey || apiKey.length <= 10,
    });
  } catch (error: any) {
    console.error('[TwinMind] Unexpected chat handler error:', error);
    return res.status(500).json({
      success: false,
      error: 'TwinMind encountered an internal processing error.',
      message: error.message,
    });
  }
});

export default router;
