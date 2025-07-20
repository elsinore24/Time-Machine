// Find the 1980s Icon - Hidden Object Game
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FIND_GAME_LEVELS } from '../../data/findGameLevels';
import './FindIconGame.css';

interface FindIconGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameState {
  currentLevel: number;
  foundObjects: Set<string>;
  gameComplete: boolean;
  showExplanation: boolean;
  currentExplanation: string;
  panX: number;
  panY: number;
  zoom: number;
  isLoading: boolean;
}

interface TouchState {
  isPanning: boolean;
  lastTouchX: number;
  lastTouchY: number;
  initialDistance: number;
  initialZoom: number;
}

const FindIconGame: React.FC<FindIconGameProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    foundObjects: new Set(),
    gameComplete: false,
    showExplanation: false,
    currentExplanation: '',
    panX: 0,
    panY: 0,
    zoom: 1,
    isLoading: false  // Start as not loading
  });

  const [touchState, setTouchState] = useState<TouchState>({
    isPanning: false,
    lastTouchX: 0,
    lastTouchY: 0,
    initialDistance: 0,
    initialZoom: 1
  });

  const [gameStarted, setGameStarted] = useState(false);

  // Current level data
  const currentLevel = FIND_GAME_LEVELS[gameState.currentLevel];

  // Initialize canvas and load background image
  useEffect(() => {
    console.log('FindIconGame useEffect triggered:', { isOpen, gameStarted, currentLevel: !!currentLevel });
    
    if (!isOpen || !gameStarted || !currentLevel) {
      console.log('Early return from useEffect');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas ref available');
      return;
    }

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      console.log('Canvas size set:', canvas.width, 'x', canvas.height);
    } else {
      console.log('No container ref available');
      // Set default size if container not available
      canvas.width = 800;
      canvas.height = 600;
    }

    // Skip image loading for now and proceed directly to game
    console.log('Starting game without background image for faster loading');
    
    // Set initial game view immediately
    const fallbackWidth = 1200;
    const fallbackHeight = 800;
    
    // Initial zoom to fit content
    const scaleX = canvas.width / fallbackWidth;
    const scaleY = canvas.height / fallbackHeight;
    const initialZoom = Math.min(scaleX, scaleY) * 0.8;
    
    console.log('Setting initial game state with zoom:', initialZoom);
    
    setGameState(prev => ({ 
      ...prev, 
      zoom: initialZoom,
      panX: (canvas.width - fallbackWidth * initialZoom) / 2,
      panY: (canvas.height - fallbackHeight * initialZoom) / 2,
      isLoading: false
    }));
  }, [isOpen, gameStarted, currentLevel]);

  // Draw UI overlay
  const drawUI = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentLevel) return;

    // Progress indicator
    const found = gameState.foundObjects.size;
    const total = currentLevel.hiddenObjects.length;
    const progress = found / total;

    // Progress bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, 20, 200, 30);

    // Progress bar fill
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(22, 22, (200 - 4) * progress, 26);

    // Progress text
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 14px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${found}/${total} Found`, 120, 40);

    // Zoom indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 100, 20, 80, 25);
    ctx.fillStyle = '#39ff14';
    ctx.font = '12px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(gameState.zoom * 100)}%`, canvas.width - 60, 37);
  }, [gameState, currentLevel]);

  // Render game on canvas
  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const backgroundImage = backgroundImageRef.current;
    
    if (!canvas || !ctx || !currentLevel) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(gameState.panX, gameState.panY);
    ctx.scale(gameState.zoom, gameState.zoom);

    if (backgroundImage) {
      // Draw background image if available
      ctx.drawImage(backgroundImage, 0, 0);
    } else {
      // Draw fallback background
      const fallbackWidth = 1200;
      const fallbackHeight = 800;
      
      // Create a gradient background as fallback
      const gradient = ctx.createLinearGradient(0, 0, fallbackWidth, fallbackHeight);
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(0.5, '#330066');
      gradient.addColorStop(1, '#1a0033');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, fallbackWidth, fallbackHeight);
      
      // Add some 80s-style decorative elements
      ctx.fillStyle = '#ff1493';
      ctx.font = 'bold 48px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🕹️ RADICAL 80S SCENE 🕹️', fallbackWidth / 2, fallbackHeight / 2);
      
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 24px Orbitron, monospace';
      ctx.fillText('Find the hidden icons!', fallbackWidth / 2, fallbackHeight / 2 + 60);
    }

    // Draw found object highlights
    currentLevel.hiddenObjects.forEach(obj => {
      if (gameState.foundObjects.has(obj.id)) {
        // Highlight found objects with neon glow
        ctx.save();
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        
        // Add pulsing fill
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.restore();
      }
    });

    // Restore context
    ctx.restore();

    // Draw UI overlay (progress, zoom controls)
    drawUI(ctx, canvas);
  }, [gameState, currentLevel, drawUI]);


  // Render game when state changes
  useEffect(() => {
    console.log('Render useEffect triggered:', { isLoading: gameState.isLoading });
    if (!gameState.isLoading) {
      console.log('Calling renderGame');
      renderGame();
    } else {
      console.log('Still loading, not rendering game');
    }
  }, [gameState, renderGame]);

  // Handle canvas click/tap
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentLevel || gameState.showExplanation) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Transform screen coordinates to world coordinates
    const worldX = (canvasX - gameState.panX) / gameState.zoom;
    const worldY = (canvasY - gameState.panY) / gameState.zoom;

    // Check for hits on hidden objects
    for (const obj of currentLevel.hiddenObjects) {
      if (gameState.foundObjects.has(obj.id)) continue;

      if (worldX >= obj.x && worldX <= obj.x + obj.width &&
          worldY >= obj.y && worldY <= obj.y + obj.height) {
        
        // Object found!
        const newFoundObjects = new Set(gameState.foundObjects);
        newFoundObjects.add(obj.id);
        
        const allFound = newFoundObjects.size === currentLevel.hiddenObjects.length;
        
        setGameState(prev => ({
          ...prev,
          foundObjects: newFoundObjects,
          showExplanation: true,
          currentExplanation: obj.explanation,
          gameComplete: allFound
        }));
        
        break;
      }
    }
  }, [gameState, currentLevel]);

  // Handle mouse panning
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.showExplanation) return;
    
    setTouchState(prev => ({
      ...prev,
      isPanning: true,
      lastTouchX: event.clientX,
      lastTouchY: event.clientY
    }));
  }, [gameState.showExplanation]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!touchState.isPanning || gameState.showExplanation) return;

    const deltaX = event.clientX - touchState.lastTouchX;
    const deltaY = event.clientY - touchState.lastTouchY;

    setGameState(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY
    }));

    setTouchState(prev => ({
      ...prev,
      lastTouchX: event.clientX,
      lastTouchY: event.clientY
    }));
  }, [touchState, gameState.showExplanation]);

  const handleMouseUp = useCallback(() => {
    setTouchState(prev => ({ ...prev, isPanning: false }));
  }, []);

  // Handle zoom
  const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    if (gameState.showExplanation) return;
    
    event.preventDefault();
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, gameState.zoom * zoomFactor));
    
    setGameState(prev => ({ ...prev, zoom: newZoom }));
  }, [gameState]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState.showExplanation) return;
    
    event.preventDefault();
    const touches = event.touches;
    
    if (touches.length === 1) {
      // Single touch - panning
      setTouchState(prev => ({
        ...prev,
        isPanning: true,
        lastTouchX: touches[0].clientX,
        lastTouchY: touches[0].clientY
      }));
    } else if (touches.length === 2) {
      // Two finger touch - pinch zoom
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      setTouchState(prev => ({
        ...prev,
        isPanning: false,
        initialDistance: distance,
        initialZoom: gameState.zoom
      }));
    }
  }, [gameState.showExplanation, gameState.zoom]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState.showExplanation) return;
    
    event.preventDefault();
    const touches = event.touches;
    
    if (touches.length === 1 && touchState.isPanning) {
      // Single touch panning
      const deltaX = touches[0].clientX - touchState.lastTouchX;
      const deltaY = touches[0].clientY - touchState.lastTouchY;
      
      setGameState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
      
      setTouchState(prev => ({
        ...prev,
        lastTouchX: touches[0].clientX,
        lastTouchY: touches[0].clientY
      }));
    } else if (touches.length === 2 && touchState.initialDistance > 0) {
      // Pinch zoom
      const touch1 = touches[0];
      const touch2 = touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = currentDistance / touchState.initialDistance;
      const newZoom = Math.max(0.5, Math.min(3, touchState.initialZoom * scale));
      
      setGameState(prev => ({ ...prev, zoom: newZoom }));
    }
  }, [gameState.showExplanation, touchState]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState.showExplanation) return;
    
    const touches = event.touches;
    
    if (touches.length === 0) {
      // All touches ended
      setTouchState(prev => ({
        ...prev,
        isPanning: false,
        initialDistance: 0
      }));
    } else if (touches.length === 1) {
      // One finger left - switch to panning mode
      setTouchState(prev => ({
        ...prev,
        isPanning: true,
        lastTouchX: touches[0].clientX,
        lastTouchY: touches[0].clientY,
        initialDistance: 0
      }));
    }
  }, [gameState.showExplanation]);


  // Start game
  const startGame = (levelIndex: number = 0) => {
    console.log('startGame called with levelIndex:', levelIndex);
    console.log('Available levels:', FIND_GAME_LEVELS.length);
    console.log('Selected level:', FIND_GAME_LEVELS[levelIndex]);
    
    setGameState({
      currentLevel: levelIndex,
      foundObjects: new Set(),
      gameComplete: false,
      showExplanation: false,
      currentExplanation: '',
      panX: 0,
      panY: 0,
      zoom: 1,
      isLoading: false  // Set to false immediately since we're not loading images
    });
    setGameStarted(true);
    console.log('Game state updated, gameStarted set to true');
  };

  // Close explanation and continue
  const closeExplanation = () => {
    setGameState(prev => ({ ...prev, showExplanation: false }));
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameState({
      currentLevel: 0,
      foundObjects: new Set(),
      gameComplete: false,
      showExplanation: false,
      currentExplanation: '',
      panX: 0,
      panY: 0,
      zoom: 1,
      isLoading: false  // Not loading when resetting
    });
  };

  // Next level
  const nextLevel = () => {
    if (gameState.currentLevel < FIND_GAME_LEVELS.length - 1) {
      startGame(gameState.currentLevel + 1);
    } else {
      resetGame();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="find-icon-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="find-icon-modal"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {!gameStarted ? (
          // Level Selection Screen
          <div className="level-selection">
            <h2>🔍 Find the 1980s Icons</h2>
            <p className="game-description">
              Explore rad 80s scenes and discover hidden treasures from the totally tubular decade!
            </p>
            
            <div className="levels-grid">
              {FIND_GAME_LEVELS.map((level, index) => (
                <motion.div
                  key={level.id}
                  className="level-card"
                  onClick={() => startGame(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="level-preview">
                    <img src={level.background} alt={level.name} />
                  </div>
                  <h3>{level.name}</h3>
                  <p>{level.description}</p>
                  <div className="level-info">
                    {level.hiddenObjects.length} objects to find
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Game Screen
          <div className="game-screen">
            <div className="game-header">
              <h3>{currentLevel?.name}</h3>
              <div className="game-controls">
                <button className="control-btn" onClick={resetGame}>
                  🏠 Levels
                </button>
                <button className="control-btn" onClick={() => setGameState(prev => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.2) }))}>
                  🔍 Zoom In
                </button>
                <button className="control-btn" onClick={() => setGameState(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom * 0.8) }))}>
                  🔍 Zoom Out
                </button>
              </div>
            </div>

            <div className="game-container" ref={containerRef}>
              {gameState.isLoading ? (
                <div className="loading-screen">
                  <div className="spinner"></div>
                  <p>Loading rad 80s scene...</p>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="game-canvas"
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                />
              )}
            </div>

            {/* Object Found Explanation */}
            <AnimatePresence>
              {gameState.showExplanation && (
                <motion.div
                  className="explanation-overlay"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  <div className="explanation-content">
                    <h3>Totally Radical Find!</h3>
                    <p>{gameState.currentExplanation}</p>
                    {gameState.gameComplete ? (
                      <div className="completion-actions">
                        <button className="continue-btn" onClick={nextLevel}>
                          {gameState.currentLevel < FIND_GAME_LEVELS.length - 1 ? 'Next Level' : 'Play Again'}
                        </button>
                        <button className="continue-btn secondary" onClick={resetGame}>
                          Level Select
                        </button>
                      </div>
                    ) : (
                      <button className="continue-btn" onClick={closeExplanation}>
                        Keep Searching!
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <button className="close-modal-btn" onClick={onClose}>
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FindIconGame;