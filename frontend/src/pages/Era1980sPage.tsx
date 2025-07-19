// 1980s Era Page - Dedicated experience for the 1980s
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatInterface from '../components/ChatInterface';
import AudioController from '../components/audio/AudioController';
import TriviaGame from '../components/games/TriviaGame';
import CharacterGuesser from '../components/games/CharacterGuesser';
import TimeMachineAPI from '../services/api';
import { useTheme } from '../components/theme/ThemeProvider';

const Era1980sPage: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [showCharacterGuesser, setShowCharacterGuesser] = useState(false);
  const { setTheme } = useTheme();

  // Apply 1980s theme when component mounts
  useEffect(() => {
    setTheme('1980s');
  }, [setTheme]);

  // Get server info on component mount
  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const info = await TimeMachineAPI.getServerInfo();
        setServerInfo(info);
      } catch (error) {
        console.error('Failed to fetch server info:', error);
      }
    };

    fetchServerInfo();
  }, []);

  const handleOpenTrivia = () => {
    setShowTrivia(true);
  };

  const handleCloseTrivia = () => {
    setShowTrivia(false);
  };

  const handleOpenCharacterGuesser = () => {
    setShowCharacterGuesser(true);
  };

  const handleCloseCharacterGuesser = () => {
    setShowCharacterGuesser(false);
  };

  return (
    <motion.div 
      className="era-page era-1980s"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation Header */}
      <header className="era-header">
        <div className="header-content">
          <Link to="/" className="back-button">
            ← Back to Time Machine
          </Link>
          <motion.h1 
            className="era-title"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🕰️ Welcome to the 1980s!
          </motion.h1>
          <motion.p 
            className="era-subtitle"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The radical decade of neon, MTV, and totally tubular technology!
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="era-main">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChatInterface selectedEra="1980s" />
        </motion.div>

        {/* 1980s Era Features */}
        <AudioController 
          isActive={true}
          onAudioStateChange={(isPlaying) => {
            console.log('Audio state:', isPlaying);
          }}
        />
        
        <motion.button 
          className="trivia-launcher"
          onClick={handleOpenTrivia}
          title="Play 1980s Trivia!"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.8
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🎮 Play Trivia
        </motion.button>

        <motion.button 
          className="character-guesser-launcher"
          onClick={handleOpenCharacterGuesser}
          title="AI Character Mind Reader!"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🧠 Mind Reader
        </motion.button>
        
        <TriviaGame 
          isOpen={showTrivia}
          onClose={handleCloseTrivia}
        />

        <CharacterGuesser 
          isOpen={showCharacterGuesser}
          onClose={handleCloseCharacterGuesser}
        />
      </main>

      {/* Footer */}
      <footer className="era-footer">
        <div className="footer-content">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            1980s Time Machine • Powered by AI & Nostalgia
            {serverInfo && (
              <span className="server-info">
                • {serverInfo.message ? 'Backend Connected' : 'Backend Status Unknown'}
              </span>
            )}
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Era1980sPage;