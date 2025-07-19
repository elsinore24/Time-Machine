// Main App component with React Router navigation
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeProvider from './components/theme/ThemeProvider';
import LandingPage from './pages/LandingPage';
import Era1980sPage from './pages/Era1980sPage';
import ComingSoonPage from './pages/ComingSoonPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';
import './styles/theme-1980s.css';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Era-specific pages */}
            <Route path="/1980s" element={<Era1980sPage />} />
            
            {/* Coming soon page for inactive eras */}
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/1990s" element={<ComingSoonPage />} />
            <Route path="/2000s" element={<ComingSoonPage />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
