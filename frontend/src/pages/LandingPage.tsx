// Landing page with time period selector and transition effects
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EraConfig } from '../types';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEra, setSelectedEra] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define available eras
  const availableEras: EraConfig[] = [
    {
      name: '1980s',
      value: '1980s',
      description: 'The radical decade of neon, MTV, and totally tubular technology!',
      isActive: true
    },
    {
      name: '1990s', 
      value: '1990s',
      description: 'Coming soon - the grunge era awaits!',
      isActive: false
    },
    {
      name: '2000s',
      value: '2000s', 
      description: 'Coming soon - Y2K and beyond!',
      isActive: false
    }
  ];

  const handleEraSelect = (era: string) => {
    if (!availableEras.find(e => e.value === era)?.isActive) {
      navigate('/coming-soon');
      return;
    }

    setSelectedEra(era);
    setIsTransitioning(true);

    // Simulate time machine transition
    setTimeout(() => {
      navigate(`/${era}`);
    }, 2000);
  };

  if (isTransitioning) {
    return (
      <div className="time-machine-transition">
        <motion.div 
          className="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="transition-content">
            <motion.div
              className="time-portal"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: 0,
                ease: "easeInOut"
              }}
            >
              🕰️
            </motion.div>
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Traveling to the {selectedEra}...
            </motion.h2>
            <motion.div
              className="loading-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <motion.div 
        className="landing-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className="landing-header">
          <motion.h1 
            className="landing-title"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            🕰️ Time Machine
          </motion.h1>
          <motion.p 
            className="landing-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Travel back in time for nostalgic conversations!
          </motion.p>
        </header>

        <main className="era-selection">
          <motion.h2 
            className="selection-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Choose Your Destination
          </motion.h2>
          
          <div className="era-grid">
            {availableEras.map((era, index) => (
              <motion.div
                key={era.value}
                className={`era-card ${era.isActive ? 'active' : 'inactive'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={era.isActive ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0, 191, 255, 0.3)"
                } : {}}
                whileTap={era.isActive ? { scale: 0.95 } : {}}
                onClick={() => handleEraSelect(era.value)}
              >
                <div className="era-year">{era.name}</div>
                <div className="era-description">{era.description}</div>
                {!era.isActive && <div className="coming-soon-badge">Coming Soon</div>}
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="landing-footer">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Powered by AI & Nostalgia ✨
          </motion.p>
        </footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;