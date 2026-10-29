import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { ForensicStudioPage } from './pages/ForensicStudioPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { AuthPage } from './pages/AuthPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#07080b] text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Page 2 (Primary Studio): Witness Description + AI Facial Image Generation + Correction */}
              <Route path="/" element={<ForensicStudioPage />} />

              {/* Page 3: Case Studies & Forensic Archives */}
              <Route path="/cases" element={<CaseStudiesPage />} />

              {/* Page 1: Login / Registration */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
