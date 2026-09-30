import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { Simulation } from './pages/Simulation';
import { Agents } from './pages/Agents';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';

export const App: React.FC = () => {
  return (
    <CityProvider>
      <Router>
        <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans selection:bg-blue-500 selection:text-white antialiased">
          <Navbar />
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-[#f5f5f7]">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </CityProvider>
  );
};

export default App;
