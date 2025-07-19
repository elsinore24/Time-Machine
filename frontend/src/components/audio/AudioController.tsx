// Audio controller for background music and sound effects
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AudioController.css';

interface RadioStation {
  id: string;
  name: string;
  url: string;
  genre: string;
  description: string;
  frequency: string;
}

interface AudioControllerProps {
  isActive: boolean;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

const AudioController: React.FC<AudioControllerProps> = ({ 
  isActive, 
  onAudioStateChange 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentSource, setCurrentSource] = useState<'synthwave' | string>('synthwave');
  const [showControls, setShowControls] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controllerRef = useRef<HTMLDivElement | null>(null);

  // Radio stations
  const radioStations: RadioStation[] = [
    {
      id: 'dance',
      name: '80s Dance',
      url: 'https://streams.80s80s.de/dance/mp3-192/',
      genre: 'Dance',
      description: 'Non-stop 80s dance hits',
      frequency: '80.1 FM'
    },
    {
      id: 'soul',
      name: '80s Soul',
      url: 'http://streams.80s80s.de/soul/mp3-192/',
      genre: 'Soul',
      description: 'Smooth 80s soul & R&B',
      frequency: '80.2 FM'
    },
    {
      id: 'classic',
      name: 'The 80s Radio',
      url: 'http://playerservices.streamtheworld.com/pls/T_RAD_80S_S01.pls',
      genre: 'Classic',
      description: 'Best of 80s classics',
      frequency: '80.3 FM'
    },
    {
      id: 'rock',
      name: '80s Rock',
      url: 'https://stream.starfm.de/80srock/mp3-192/',
      genre: 'Rock',
      description: 'Radical 80s rock anthems',
      frequency: '80.4 FM'
    },
    {
      id: 'retro',
      name: 'Retro 80s',
      url: 'http://procyon.shoutca.st:8032',
      genre: 'Retro',
      description: 'Totally tubular 80s mix',
      frequency: '80.5 FM'
    }
  ];

  // Audio sources
  const audioSources: { [key: string]: string } = {
    synthwave: '/assets/sounds/1h Free No Copyright Music _ 80s Synthwave Electro Pop Rock Background Retrowave For YouTube Videos 4.mp3',
    ...radioStations.reduce((acc, station) => ({
      ...acc,
      [station.id]: station.url
    }), {} as { [key: string]: string })
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controllerRef.current && !controllerRef.current.contains(event.target as Node)) {
        setShowControls(false);
      }
    };

    if (showControls) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showControls]);

  const handlePlay = useCallback(async () => {
    if (audioRef.current) {
      try {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        onAudioStateChange?.(true);
      } catch (error) {
        console.error('Audio play failed:', error);
        setIsLoading(false);
      }
    }
  }, [onAudioStateChange]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      onAudioStateChange?.(false);
    }
  }, [onAudioStateChange]);

  // Auto-start audio when 1980s theme becomes active (only once)
  useEffect(() => {
    if (isActive && !hasAutoPlayed) {
      // Add small delay to handle browser autoplay restrictions
      const timer = setTimeout(() => {
        handlePlay();
        setHasAutoPlayed(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive, hasAutoPlayed, isPlaying, handlePause, handlePlay]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSourceChange = (source: 'synthwave' | string) => {
    setCurrentSource(source);
    setIsLoading(true);
    
    // Save to localStorage
    localStorage.setItem('timeMachineAudioSource', source);
    
    // Restart playback with new source
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          if (wasPlaying) {
            audioRef.current.play().then(() => {
              setIsLoading(false);
            }).catch((error) => {
              console.error('Failed to play new source:', error);
              setIsLoading(false);
            });
          } else {
            setIsLoading(false);
          }
        }
      }, 100);
    }
  };

  // Load saved source on mount
  useEffect(() => {
    const savedSource = localStorage.getItem('timeMachineAudioSource');
    if (savedSource && (savedSource === 'synthwave' || radioStations.find(s => s.id === savedSource))) {
      setCurrentSource(savedSource);
    }
  }, [radioStations]);

  const getCurrentStation = () => {
    if (currentSource === 'synthwave') return null;
    return radioStations.find(station => station.id === currentSource);
  };

  const getCurrentSourceName = () => {
    if (currentSource === 'synthwave') return 'Synthwave Mix';
    const station = getCurrentStation();
    return station ? station.name : 'Unknown Station';
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="audio-controller" ref={controllerRef}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioSources[currentSource]}
        loop={currentSource === 'synthwave'}
        style={{ display: 'none' }}
        onError={(error) => {
          console.error('Audio error:', error);
          setIsLoading(false);
          // Fallback to synthwave if radio fails
          if (currentSource !== 'synthwave') {
            setCurrentSource('synthwave');
          }
        }}
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }}
      />

      {/* Audio Controls */}
      <div className={`audio-controls ${showControls ? 'expanded' : 'collapsed'}`}>
        <button 
          className="audio-toggle-btn"
          onClick={toggleControls}
          title="Audio Controls"
        >
          🎵
        </button>

        {showControls && (
          <div className="audio-panel">
            <div className="audio-section">
              <label className="audio-label">🎶 Music:</label>
              <div className="audio-buttons">
                <button
                  className={`audio-btn ${isPlaying ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : (isPlaying ? '⏸️' : '▶️')}
                </button>
              </div>
            </div>

            {/* Volume Control - Hidden on Mobile */}
            {!isMobile && (
              <div className="audio-section">
                <label className="audio-label">🔊 Volume:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-display">{Math.round(volume * 100)}%</span>
              </div>
            )}

            {/* Mobile Volume Message */}
            {isMobile && (
              <div className="audio-section mobile-volume-message">
                <label className="audio-label">🔊 Volume:</label>
                <span className="mobile-hint">Use your phone's volume buttons</span>
              </div>
            )}

            {/* Station Roller */}
            <div className="audio-section">
              <label className="audio-label">📻 Station:</label>
              
              {/* Synthwave Option */}
              <div className="station-options">
                <button
                  className={`station-btn ${currentSource === 'synthwave' ? 'active' : ''}`}
                  onClick={() => handleSourceChange('synthwave')}
                >
                  <div className="station-info">
                    <div className="station-name">Synthwave Mix</div>
                    <div className="station-freq">Local</div>
                  </div>
                </button>
              </div>

              {/* Radio Station Roller */}
              <div className="station-roller">
                {radioStations.map((station) => (
                  <button
                    key={station.id}
                    className={`station-btn ${currentSource === station.id ? 'active' : ''}`}
                    onClick={() => handleSourceChange(station.id)}
                  >
                    <div className="station-info">
                      <div className="station-name">{station.name}</div>
                      <div className="station-freq">{station.frequency}</div>
                      <div className="station-genre">{station.genre}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="audio-info">
              <div className="now-playing">
                🎵 {getCurrentSourceName()}
                {getCurrentStation() && (
                  <div className="station-description">
                    {getCurrentStation()?.description}
                  </div>
                )}
              </div>
              {(isPlaying && !isLoading) && (
                <div className="equalizer">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AudioController;