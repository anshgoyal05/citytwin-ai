import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { useCity } from '../context/CityContext';
import { Bot, User, Send, Sparkles, CheckCircle2, MapPin, Building, ArrowRight } from 'lucide-react';

export const Assistant: React.FC = () => {
  const { sectors, hospitals, candidateSites, summaryMetrics, flyToLocation } = useCity();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Greetings. I am your CityTwin AI Spatial Planning Copilot for Chandigarh. I have full telemetry access to 64 sectors, 11 primary healthcare centers, and 6 candidate infrastructure sites. How may I assist your urban analysis?',
      timestamp: '10:00 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Which sectors have the highest healthcare gap in Chandigarh?',
    'Why is Site Alpha (Sector 52) ranked #1?',
    'What is the bed capacity comparison between PGIMER and GMCH 32?',
    'How will building in Sarangpur help New Chandigarh?',
  ];

  const presetResponses: Record<string, { text: string; badge?: string; focusCoords?: [number, number] }> = {
    'Which sectors have the highest healthcare gap in Chandigarh?': {
      text: `Based on spatial distance analysis across all 64 sectors, 14 sectors currently experience a critical accessibility deficit (>3.0 km distance from any tertiary hospital). The most underserved demographic pockets are Sector 52 (4.6 km to GMCH 32), Maloya (4.8 km to GMSH 16), Dhanas (3.8 km to PGIMER), and Sector 56 (3.4 km). Combined, these sectors represent over 150,000 residents without immediate emergency care.`,
      badge: '14 UNDERSERVED SECTORS IDENTIFIED',
      focusCoords: [76.7215, 30.7095],
    },
    'Why is Site Alpha (Sector 52) ranked #1?': {
      text: `Site Alpha in Sector 52 ranks #1 (Score: 93.4/100) due to four decisive factors:\n1. Extreme population density (>40,000/km² in Sector 52, Maloya, and Dadumajra).\n2. Longest distance to nearest existing hospital (4.6 km), cutting emergency ambulance response time from 28 minutes to 6 minutes.\n3. Available 8.4 acres of municipal land adjacent to Vikas Marg.\n4. Direct relief of emergency ward overload at GMCH Sector 32.`,
      badge: 'TOP SUITABILITY: 93.4 / 100',
      focusCoords: [76.7215, 30.7095],
    },
    'What is the bed capacity comparison between PGIMER and GMCH 32?': {
      text: `PGIMER (Sector 12) is a premier national institute with 2,200 beds, 180 ICU beds, and over 10,500 daily outpatients. GMCH 32 (Sector 32) is a government medical college hospital with 950 beds, 85 ICU beds, and ~4,200 daily outpatients. Together with GMSH 16 (500 beds), these three centers account for 77% of all hospital beds in the Union Territory, creating heavy geographic centralization in northern and central Chandigarh.`,
      badge: 'BED CONCENTRATION: 77% IN 3 SITES',
      focusCoords: [76.7765, 30.7645],
    },
    'How will building in Sarangpur help New Chandigarh?': {
      text: `Site Beta in Sarangpur offers a large 14.2-acre parcel in the designated Institutional Zone. Developing a 400-bed facility here intercepts patient influx from Mullanpur (New Chandigarh) and Punjab borders before traffic overwhelms the Madhya Marg corridor and PGIMER emergency gates.`,
      badge: 'STRATEGIC GATEWAY BUFFER',
      focusCoords: [76.751, 30.771],
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      let replyText =
        "I've cross-referenced that query against the Chandigarh spatial database. For optimal planning, our multi-factor scoring suggests focusing on southern and western peripheral corridors where population density exceeds 30,000 residents per square kilometer.";
      let badge = 'SPATIAL TELEMETRY SYNTHESIS';

      if (presetResponses[query]) {
        replyText = presetResponses[query].text;
        badge = presetResponses[query].badge || badge;
      } else {
        // dynamic lookup
        const lower = query.toLowerCase();
        if (lower.includes('pgi') || lower.includes('12')) {
          replyText =
            'PGIMER is situated in Sector 12 with 2,200 beds and Level-1 Trauma facilities. It primarily serves northern Chandigarh, Punjab, and Himachal Pradesh.';
          badge = 'PGIMER SECTOR 12';
        } else if (lower.includes('sector 52') || lower.includes('alpha')) {
          replyText =
            'Site Alpha in Sector 52 is our highest-ranked candidate site (93.4/100). It covers 8.4 acres of vacant land and has 142,000 residents within a 2km radius.';
          badge = 'SITE ALPHA SECTOR 52';
        } else if (lower.includes('bed') || lower.includes('beds')) {
          replyText = `Chandigarh currently has ${summaryMetrics.totalBeds.toLocaleString()} hospital beds across ${summaryMetrics.totalHospitals} major facilities, representing an average of ${summaryMetrics.avgBedsPer1000} beds per 1,000 residents.`;
          badge = 'HOSPITAL BEDS METRIC';
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsBadge: badge,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto p-4 md:p-6 font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-apple-border-light dark:border-apple-border-dark">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHANDIGARH SPATIAL COPILOT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Urban Planning Assistant
          </h1>
        </div>
        <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark font-medium">
          64 Sectors • 11 Hospitals Live
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
              <div className="whitespace-pre-line">{m.text}</div>
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
            <span>Analyzing Chandigarh spatial layers...</span>
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
            placeholder="Ask about Chandigarh sectors, hospital beds, or candidate site rankings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white dark:bg-[#161617] border border-apple-border-light dark:border-apple-border-dark text-xs md:text-sm text-apple-text-primary-light dark:text-apple-text-primary-dark placeholder:text-apple-text-tertiary font-sans focus:outline-none focus:ring-2 focus:ring-apple-accent shadow-apple-card"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 rounded-full bg-apple-accent hover:bg-apple-accent-hover text-white disabled:opacity-40 transition-all shadow-apple-card"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
