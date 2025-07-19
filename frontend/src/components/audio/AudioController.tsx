// Audio controller for background music and sound effects
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AudioController.css';

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
  const [currentSource, setCurrentSource] = useState<'synthwave' | 'radio'>('synthwave');
  const [showControls, setShowControls] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio sources
  const audioSources = {
    synthwave: '/assets/sounds/1h Free No Copyright Music _ 80s Synthwave Electro Pop Rock Background Retrowave For YouTube Videos 4.mp3',
    radio: 'http://puma.streemlion.com:2910/stream'
  };

  const handlePlay = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        onAudioStateChange?.(true);
      } catch (error) {
        console.error('Audio play failed:', error);
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

  const handleSourceChange = (source: 'synthwave' | 'radio') => {
    setCurrentSource(source);
    // Restart playback with new source
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="audio-controller">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioSources[currentSource]}
        loop={currentSource === 'synthwave'}
        style={{ display: 'none' }}
        onError={(error) => {
          console.error('Audio error:', error);
          // Fallback to synthwave if radio fails
          if (currentSource === 'radio') {
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
                  className={`audio-btn ${isPlaying ? 'active' : ''}`}
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>

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

            <div className="audio-section">
              <label className="audio-label">📻 Source:</label>
              <div className="source-buttons">
                <button
                  className={`source-btn ${currentSource === 'synthwave' ? 'active' : ''}`}
                  onClick={() => handleSourceChange('synthwave')}
                >
                  Synthwave
                </button>
                <button
                  className={`source-btn ${currentSource === 'radio' ? 'active' : ''}`}
                  onClick={() => handleSourceChange('radio')}
                >
                  80s Radio
                </button>
              </div>
            </div>

            <div className="audio-info">
              <div className="now-playing">
                🎵 {currentSource === 'synthwave' ? 'Synthwave Mix' : '80s Radio Stream'}
              </div>
              {isPlaying && (
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