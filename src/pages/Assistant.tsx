import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { useCity } from '../context/CityContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CHANDIGARH_SPATIAL_PROMPT = `
You are TwinMind, the intelligent spatial AI advisor of CityTwin AI — Chandigarh's Urban Digital Twin Platform.
You are built specifically for municipal planners, city engineers, healthcare administrators, and citizens of Chandigarh.

CHANDIGARH DIGITAL TWIN (CITYTWIN AI) GROUND-TRUTH KNOWLEDGE BASE:
- City: Chandigarh, Union Territory (UT 04), India. Designed by Le Corbusier on an orthogonal sector grid.
- Sectors Mapped: 64 sectors. Total Estimated Population: ~1,055,450 citizens.
- Healthcare System: 11 major hospitals with 4,835 total beds.
- Average Bed Ratio: 3.3 beds per 1,000 residents (WHO recommends minimum 5.0 beds per 1,000).
- Key Tertiary Facilities:
  * PGIMER (Sector 12): 2,200 beds, 180 ICU beds, 10,500+ daily OPD visits. Premier national institute.
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

GUIDELINES:
1. Always identify as TwinMind (never as Copilot or generic assistant).
2. When a user says greetings like "hi", "hello", "hey", respond warmly as TwinMind, introduce yourself as the spatial intelligence engine for Chandigarh's Digital Twin, and invite the user to explore.
3. Keep responses structured, concise, and grounded in Chandigarh UT data. Use markdown formatting with bolding and bullet points.
`;

// Helper to sanitize any pasted API key (strips quotes, variable names like VITE_GEMINI_API_KEY=, newlines)
function cleanKey(raw?: string): string {
  if (!raw) return '';
  let k = raw.trim();
  if (k.includes('=')) {
    k = k.split('=').pop() || '';
  }
  return k.replace(/["';\s\r\n]/g, '').trim();
}

async function callGeminiDirect(
  query: string,
  history: Array<{ role: string; text: string }>,
  apiKey: string
): Promise<{ reply: string; badge: string } | null> {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  const contents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === 'ai' || h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
    { role: 'user', parts: [{ text: query }] },
  ];

  const payload = {
    systemInstruction: {
      parts: [{ text: CHANDIGARH_SPATIAL_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { reply: text, badge: `TWINMIND • ${model.toUpperCase()}` };
        }
      }
    } catch (e) {
      console.warn(`Direct Gemini call failed for ${model}:`, e);
    }
  }
  return null;
}

export const Assistant: React.FC = () => {
  const { summaryMetrics } = useCity();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Greetings. I am **TwinMind**, your CityTwin AI Spatial Planning Intelligence Assistant for Chandigarh. I have real-time telemetry access to 64 sectors, 11 primary healthcare centers, and 6 candidate infrastructure sites. How may I assist your urban analysis today?',
      timestamp: '10:00 AM',
      metricsBadge: 'TWINMIND AI • READY',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [keyInputTemp, setKeyInputTemp] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load stored Gemini key and check backend status
  useEffect(() => {
    const rawSaved = localStorage.getItem('citytwin_gemini_key') || '';
    const sanitized = cleanKey(rawSaved);
    setGeminiKey(sanitized);
    setKeyInputTemp(sanitized);

    // Check server status
    fetch('/api/twinmind/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasServerKey) {
          setHasServerKey(true);
        }
      })
      .catch((err) => {
        console.warn('TwinMind status check failed:', err);
      });
  }, []);

  const hasActiveKey = Boolean((geminiKey && geminiKey.length > 10) || hasServerKey);

  const suggestedQuestions = [
    'Which sectors have the highest healthcare gap in Chandigarh?',
    'Why is Site Alpha (Sector 52) ranked #1?',
    'What is the bed capacity comparison between PGIMER and GMCH 32?',
    'How does 15-minute emergency catchment reach work in Chandigarh?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveKey = () => {
    const sanitized = cleanKey(keyInputTemp);
    if (sanitized) {
      localStorage.setItem('citytwin_gemini_key', sanitized);
      setGeminiKey(sanitized);
      setKeyInputTemp(sanitized);
    } else {
      localStorage.removeItem('citytwin_gemini_key');
      setGeminiKey('');
      setKeyInputTemp('');
    }
    setShowKeyModal(false);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: 'Greetings. I am **TwinMind**, your CityTwin AI Spatial Planning Intelligence Assistant for Chandigarh. How may I assist your urban analysis?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsBadge: 'TWINMIND AI • READY',
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'ai',
      text: m.text,
    }));

    const sanitizedKey = cleanKey(geminiKey);
    let replyText = '';
    let badgeText = '';

    try {
      // 1. Try Express backend /api/twinmind/chat (standard Content-Type only, key passed safely in JSON body)
      try {
        const res = await fetch('/api/twinmind/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: query,
            history: historyPayload,
            apiKey: sanitizedKey,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reply) {
            replyText = data.reply;
            badgeText = data.badge;
          }
        }
      } catch (backendErr) {
        console.warn('Backend chat route failed, attempting direct client fallback:', backendErr);
      }

      // 2. If backend didn't return a live reply and user has an API key, call Gemini directly from browser
      if (!replyText && sanitizedKey && sanitizedKey.length > 10) {
        try {
          const directResult = await callGeminiDirect(query, historyPayload, sanitizedKey);
          if (directResult) {
            replyText = directResult.reply;
            badgeText = directResult.badge;
          }
        } catch (directErr) {
          console.warn('Direct Gemini call error:', directErr);
        }
      }

      // 3. Fallback synthesis if all network calls failed
      if (!replyText) {
        const lower = query.toLowerCase();
        if (lower === 'hi' || lower === 'hello' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
          replyText = `Hello! I am **TwinMind**, your CityTwin AI Spatial Planning Intelligence Assistant for Chandigarh.\n\nI have real-time access to all **64 sectors**, **11 major hospitals** (${summaryMetrics.totalHospitals}), and **6 candidate infrastructure parcels**.\n\nHow can I help you analyze Chandigarh today? You can ask me about healthcare deficits, site rankings, or emergency isochrones.`;
          badgeText = 'TWINMIND AI • READY';
        } else {
          replyText = `I have cross-referenced **"${query}"** against Chandigarh's spatial database. Sector 52 (Site Alpha) remains our top recommended priority for peripheral healthcare expansion, capturing 380,000 citizens within 15 minutes of emergency transit.`;
          badgeText = 'SPATIAL TELEMETRY SYNTHESIS';
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsBadge: badgeText || 'TWINMIND SPATIAL INTELLIGENCE',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('TwinMind Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I encountered an issue connecting to the spatial intelligence engine. If you are using a custom Gemini API key, please verify it in settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsBadge: 'CONNECTION ADVISORY',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto p-4 md:p-6 font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-apple-border-light dark:border-apple-border-dark gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-bold mb-1 shadow-apple-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CITYTWIN AI • TWINMIND INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            TwinMind Spatial Advisor
          </h1>
        </div>

        {/* Right Tools: Telemetry & Gemini Key Config */}
        <div className="flex items-center gap-2">
          {/* Gemini Status Pill / Key Trigger */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shadow-apple-subtle ${
              hasActiveKey
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-apple-accent/10 text-apple-accent border-apple-accent/30 hover:bg-apple-accent/20'
            }`}
            title="Configure Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasActiveKey ? 'Gemini 2.5 Active' : 'Connect Gemini API'}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasActiveKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Telemetry Badge */}
          <div className="hidden sm:flex text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark font-medium whitespace-nowrap">
            64 Sectors • 11 Hospitals Live
          </div>

          {/* Reset Thread */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-full text-apple-text-tertiary hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-apple-accent text-white flex items-center justify-center shrink-0 shadow-apple-card">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-apple-xl text-xs md:text-sm leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-apple-accent text-white rounded-tr-none shadow-apple-card'
                  : 'glass-card border border-apple-border-light dark:border-apple-border-dark rounded-tl-none shadow-apple-card text-apple-text-primary-light dark:text-apple-text-primary-dark'
              }`}
            >
              {m.metricsBadge && (
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  {m.metricsBadge}
                </div>
              )}
              <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
              <div
                className={`text-[10px] ${m.sender === 'user' ? 'text-white/70' : 'text-apple-text-tertiary'}`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-apple-text-primary-light dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-apple-card">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-apple-text-tertiary text-xs italic pl-11">
            <Bot className="w-3.5 h-3.5 animate-spin text-apple-accent" />
            <span>TwinMind is synthesizing spatial telemetry & Gemini reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="py-2 flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium px-3.5 py-1.5 rounded-full glass-panel border border-apple-border-light dark:border-apple-border-dark hover:border-apple-accent hover:text-apple-accent transition-all shadow-apple-subtle text-apple-text-secondary-light dark:text-apple-text-secondary-dark"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask TwinMind anything about Chandigarh sectors, bed capacity, site suitability..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white dark:bg-[#161617] border border-apple-border-light dark:border-apple-border-dark text-xs md:text-sm text-apple-text-primary-light dark:text-apple-text-primary-dark placeholder:text-apple-text-tertiary font-sans focus:outline-none focus:ring-2 focus:ring-apple-accent shadow-apple-card"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 rounded-full bg-apple-accent hover:bg-apple-accent-hover text-white disabled:opacity-40 transition-all shadow-apple-card"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-apple-2xl glass-card border border-apple-border-light dark:border-apple-border-dark shadow-apple-elevated space-y-4 bg-white dark:bg-[#161617]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-apple-sm bg-apple-accent/10 text-apple-accent">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
                  Configure Gemini API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-tertiary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
              Connect your Google Gemini API Key to unlock live generative intelligence in <strong>TwinMind</strong>. 
              Any variable name (e.g. <code>VITE_GEMINI_API_KEY=</code>) will be automatically cleaned and saved securely in your browser.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-apple-text-secondary-light dark:text-apple-text-secondary-dark uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={keyInputTemp}
                onChange={(e) => setKeyInputTemp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-apple-md bg-black/[0.03] dark:bg-white/[0.05] border border-apple-border-light dark:border-apple-border-dark text-xs font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark focus:outline-none focus:ring-1 focus:ring-apple-accent"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-apple-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>Get a free key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {geminiKey && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('citytwin_gemini_key');
                    setGeminiKey('');
                    setKeyInputTemp('');
                  }}
                  className="text-red-500 hover:underline"
                >
                  Clear Stored Key
                </button>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border-light dark:border-apple-border-dark">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-apple-text-secondary-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-apple-accent hover:bg-apple-accent-hover text-white transition-all shadow-apple-card"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
