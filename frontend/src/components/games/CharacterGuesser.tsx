// 1980s Character Guesser Game - AI-powered guessing game
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CharacterGuesser.css';

interface CharacterGuesserProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameState {
  gameId: string | null;
  currentQuestion: string | null;
  charactersRemaining: number;
  gameComplete: boolean;
  finalGuess: string | null;
  aiMessage: string;
  confidence: number;
  questionCount: number;
}

const CharacterGuesser: React.FC<CharacterGuesserProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    currentQuestion: null,
    charactersRemaining: 0,
    gameComplete: false,
    finalGuess: null,
    aiMessage: "Ready to start guessing!",
    confidence: 0,
    questionCount: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userGuessResult, setUserGuessResult] = useState<'correct' | 'incorrect' | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/guess-game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: `session_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const data = await response.json();
      
      setGameState({
        gameId: data.game_id,
        currentQuestion: data.first_question,
        charactersRemaining: data.characters_remaining,
        gameComplete: false,
        finalGuess: null,
        aiMessage: data.message,
        confidence: 0,
        questionCount: 1
      });

      setGameStarted(true);
      setUserGuessResult(null);
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState(prev => ({
        ...prev,
        aiMessage: "Sorry, I couldn't start the game. Please try again later!"
      }));
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const answerQuestion = useCallback(async (answer: boolean) => {
    if (!gameState.gameId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/guess-game/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: gameState.gameId,
          answer: answer
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: data.next_question,
        charactersRemaining: data.characters_remaining,
        gameComplete: data.game_complete,
        finalGuess: data.final_guess,
        aiMessage: data.ai_message,
        confidence: data.confidence,
        questionCount: prev.questionCount + 1
      }));

    } catch (error) {
      console.error('Error submitting answer:', error);
      setGameState(prev => ({
        ...prev,
        aiMessage: "Oops! Something went wrong. Let me try again..."
      }));
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, isLoading, API_BASE_URL]);

  const handleGuessResult = useCallback(async (wasCorrect: boolean) => {
    setUserGuessResult(wasCorrect ? 'correct' : 'incorrect');
    
    // End the game with feedback
    if (gameState.gameId) {
      try {
        await fetch(`${API_BASE_URL}/guess-game/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            game_id: gameState.gameId,
            action: 'end',
            user_feedback: wasCorrect ? 'AI guessed correctly!' : 'AI guessed incorrectly'
          })
        });
      } catch (error) {
        console.error('Error ending game:', error);
      }
    }
  }, [gameState.gameId, API_BASE_URL]);

  const resetGame = useCallback(() => {
    setGameState({
      gameId: null,
      currentQuestion: null,
      charactersRemaining: 0,
      gameComplete: false,
      finalGuess: null,
      aiMessage: "Ready to start guessing!",
      confidence: 0,
      questionCount: 0
    });
    setGameStarted(false);
    setUserGuessResult(null);
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      className="character-guesser-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="character-guesser-modal"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {!gameStarted ? (
          // Welcome Screen
          <div className="guesser-welcome">
            <h2>🧠 80s Character Mind Reader</h2>
            <div className="welcome-content">
              <p>Think of any iconic character from the 1980s, and I'll try to guess who it is!</p>
              
              <div className="game-instructions">
                <h3>How to Play:</h3>
                <ul>
                  <li>🎭 Think of a famous 1980s character (real or fictional)</li>
                  <li>🤔 Answer my yes/no questions honestly</li>
                  <li>🎯 I'll try to guess your character in 20 questions or less!</li>
                  <li>🏆 See if you can stump the AI!</li>
                </ul>
              </div>

              <div className="character-examples">
                <h4>Examples of 80s characters:</h4>
                <div className="example-grid">
                  <span>E.T.</span>
                  <span>Madonna</span>
                  <span>Optimus Prime</span>
                  <span>Mr. T</span>
                  <span>Pac-Man</span>
                  <span>Princess Leia</span>
                </div>
              </div>

              <button 
                className="start-game-btn" 
                onClick={startNewGame}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start the Mind Reading!'}
              </button>
            </div>
          </div>
        ) : gameState.gameComplete && gameState.finalGuess ? (
          // Final Guess Screen
          <div className="guesser-final-guess">
            <h2>🎯 My Final Guess!</h2>
            
            <div className="guess-content">
              <div className="ai-message">
                <p>{gameState.aiMessage}</p>
              </div>

              <div className="final-character">
                <h3>"{gameState.finalGuess}"</h3>
                <div className="confidence-meter">
                  <div className="confidence-label">Confidence:</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${gameState.confidence * 100}%` }}
                    />
                  </div>
                  <div className="confidence-percent">
                    {Math.round(gameState.confidence * 100)}%
                  </div>
                </div>
              </div>

              <div className="game-stats">
                <div className="stat">
                  <span className="stat-number">{gameState.questionCount - 1}</span>
                  <span className="stat-label">Questions Asked</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{gameState.charactersRemaining}</span>
                  <span className="stat-label">Possible Matches</span>
                </div>
              </div>

              {userGuessResult === null && (
                <div className="guess-feedback">
                  <h4>Was I correct?</h4>
                  <div className="feedback-buttons">
                    <button 
                      className="correct-btn"
                      onClick={() => handleGuessResult(true)}
                    >
                      ✅ Yes, that's right!
                    </button>
                    <button 
                      className="incorrect-btn"
                      onClick={() => handleGuessResult(false)}
                    >
                      ❌ No, try again!
                    </button>
                  </div>
                </div>
              )}

              {userGuessResult === 'correct' && (
                <div className="result-message success">
                  <h3>🎉 Awesome! I got it right!</h3>
                  <p>I love using my AI powers to read minds! Thanks for playing!</p>
                </div>
              )}

              {userGuessResult === 'incorrect' && (
                <div className="result-message challenge">
                  <h3>🤯 You stumped me!</h3>
                  <p>Great choice! That character must be pretty unique. You win this round!</p>
                </div>
              )}

              <div className="game-actions">
                <button className="play-again-btn" onClick={resetGame}>
                  🔄 Play Again
                </button>
                <button className="close-btn" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Question Screen
          <div className="guesser-question">
            <div className="game-header">
              <div className="progress-info">
                <div className="question-counter">
                  Question {gameState.questionCount} of 20
                </div>
                <div className="characters-remaining">
                  {gameState.charactersRemaining} possibilities left
                </div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(gameState.questionCount / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="ai-avatar">
              🤖
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.questionCount}
                className="question-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="ai-message">
                  <p>{gameState.aiMessage}</p>
                </div>

                <div className="current-question">
                  <h3>{gameState.currentQuestion}</h3>
                </div>

                <div className="answer-buttons">
                  <motion.button
                    className="answer-btn yes-btn"
                    onClick={() => answerQuestion(true)}
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  >
                    👍 Yes
                  </motion.button>
                  
                  <motion.button
                    className="answer-btn no-btn"
                    onClick={() => answerQuestion(false)}
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  >
                    👎 No
                  </motion.button>
                </div>

                {isLoading && (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Thinking...</p>
                  </div>
                )}
              </motion.div>
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

export default CharacterGuesser;