import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { Navbar } from './components/Navbar';
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
        <div className="min-h-screen bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-primary-light dark:text-apple-text-primary-dark flex flex-col font-sans selection:bg-apple-accent selection:text-white antialiased transition-colors duration-200">
          <Navbar />
          <main className="flex-1 w-full bg-apple-bg-light dark:bg-apple-bg-dark">
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
      </Router>
    </CityProvider>
  );
};

export default App;
