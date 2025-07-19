// Main App component with era dropdown (locked to 1980s) and chat interface
import React, { useState, useEffect } from 'react';
import EraSelector from './components/EraSelector';
import ChatInterface from './components/ChatInterface';
import TimeMachineAPI from './services/api';
import { EraConfig } from './types';
import ThemeProvider, { useTheme } from './components/theme/ThemeProvider';
import AudioController from './components/audio/AudioController';
import TriviaGame from './components/games/TriviaGame';
import './App.css';
import './styles/theme-1980s.css';

const AppContent: React.FC = () => {
  const [selectedEra, setSelectedEra] = useState<string>('1980s');
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const { setTheme } = useTheme();

  // Define available eras (only 1980s active for MVP)
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

  const handleEraChange = (era: string) => {
    console.log('Era changed to:', era);
    setSelectedEra(era);
    // Apply theme when era changes
    setTheme(era);
  };

  // Apply initial theme
  useEffect(() => {
    setTheme(selectedEra);
  }, [setTheme]);

  const handleOpenTrivia = () => {
    setShowTrivia(true);
  };

  const handleCloseTrivia = () => {
    setShowTrivia(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            🕰️ Time Machine
          </h1>
          <p className="app-subtitle">
            Travel back in time for nostalgic conversations!
          </p>
          <EraSelector
            selectedEra={selectedEra}
            onEraChange={handleEraChange}
            eras={availableEras}
          />
        </div>
      </header>

      <main className="app-main">
        <ChatInterface selectedEra={selectedEra} />
        
        {/* 1980s Era Features */}
        {selectedEra === '1980s' && (
          <>
            <AudioController 
              isActive={true}
              onAudioStateChange={(isPlaying) => {
                console.log('Audio state:', isPlaying);
              }}
            />
            
            <button 
              className="trivia-launcher"
              onClick={handleOpenTrivia}
              title="Play 1980s Trivia!"
            >
              🎮 Play Trivia
            </button>
            
            <TriviaGame 
              isOpen={showTrivia}
              onClose={handleCloseTrivia}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Time Machine MVP • Powered by AI & Nostalgia
            {serverInfo && (
              <span className="server-info">
                • {serverInfo.message ? 'Backend Connected' : 'Backend Status Unknown'}
              </span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
