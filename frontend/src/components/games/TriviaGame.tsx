// 1980s Trivia Game - Interactive nostalgia quiz
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriviaQuestion, getRandomQuestions } from '../../data/triviaQuestions';
import './TriviaGame.css';

interface TriviaGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameState {
  currentQuestion: number;
  score: number;
  questions: TriviaQuestion[];
  selectedAnswer: number | null;
  showExplanation: boolean;
  gameComplete: boolean;
  streak: number;
  totalTime: number;
}

const TriviaGame: React.FC<TriviaGameProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    questions: [],
    selectedAnswer: null,
    showExplanation: false,
    gameComplete: false,
    streak: 0,
    totalTime: 0
  });

  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  useEffect(() => {
    if (isOpen && !gameStarted) {
      startNewGame();
    }
  }, [isOpen]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameState.showExplanation && !gameState.gameComplete) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameState.showExplanation) {
      // Time's up - treat as wrong answer
      handleAnswer(-1);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameState.showExplanation, gameState.gameComplete]);

  const startNewGame = () => {
    const questions = getRandomQuestions(5); // 5 questions per game
    setGameState({
      currentQuestion: 0,
      score: 0,
      questions,
      selectedAnswer: null,
      showExplanation: false,
      gameComplete: false,
      streak: 0,
      totalTime: 0
    });
    setTimeLeft(30);
    setGameStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (gameState.selectedAnswer !== null) return;

    const currentQ = gameState.questions[gameState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    const timeBonus = Math.max(0, timeLeft - 10); // Bonus points for speed

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showExplanation: true,
      score: isCorrect ? prev.score + 10 + timeBonus : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalTime: prev.totalTime + (30 - timeLeft)
    }));
  };

  const nextQuestion = () => {
    const nextIndex = gameState.currentQuestion + 1;
    if (nextIndex >= gameState.questions.length) {
      // Game complete
      setGameState(prev => ({ ...prev, gameComplete: true }));
    } else {
      // Next question
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        selectedAnswer: null,
        showExplanation: false
      }));
      setTimeLeft(30);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameState({
      currentQuestion: 0,
      score: 0,
      questions: [],
      selectedAnswer: null,
      showExplanation: false,
      gameComplete: false,
      streak: 0,
      totalTime: 0
    });
  };

  const getScoreGrade = () => {
    const percentage = (gameState.score / (gameState.questions.length * 10)) * 100;
    if (percentage >= 90) return { grade: 'A+', comment: 'Totally radical! You\'re a true 80s expert!' };
    if (percentage >= 80) return { grade: 'A', comment: 'Awesome! You really know your 80s stuff!' };
    if (percentage >= 70) return { grade: 'B', comment: 'Pretty good! You\'ve got some solid 80s knowledge!' };
    if (percentage >= 60) return { grade: 'C', comment: 'Not bad! Time to brush up on your 80s trivia!' };
    return { grade: 'D', comment: 'Gag me with a spoon! You need more 80s education!' };
  };

  if (!isOpen) return null;

  const currentQ = gameState.questions[gameState.currentQuestion];

  return (
    <motion.div
      className="trivia-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="trivia-modal"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {!gameStarted ? (
          // Welcome Screen
          <div className="trivia-welcome">
            <h2>🎮 1980s Trivia Challenge</h2>
            <p>Test your knowledge of the radical decade!</p>
            <div className="game-rules">
              <h3>How to Play:</h3>
              <ul>
                <li>📝 Answer 5 questions about the 1980s</li>
                <li>⏰ You have 30 seconds per question</li>
                <li>🏆 Earn bonus points for quick answers</li>
                <li>🔥 Build streaks for extra rad points!</li>
              </ul>
            </div>
            <button className="start-game-btn" onClick={startNewGame}>
              Start Playing!
            </button>
          </div>
        ) : gameState.gameComplete ? (
          // Results Screen
          <div className="trivia-results">
            <h2>🏆 Game Over!</h2>
            <div className="final-score">
              <div className="score-display">
                <span className="score-number">{gameState.score}</span>
                <span className="score-label">Total Points</span>
              </div>
              <div className="grade-display">
                <span className="grade">{getScoreGrade().grade}</span>
                <span className="grade-comment">{getScoreGrade().comment}</span>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-number">{gameState.questions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat">
                <span className="stat-number">{gameState.streak}</span>
                <span className="stat-label">Best Streak</span>
              </div>
              <div className="stat">
                <span className="stat-number">{Math.round(gameState.totalTime)}s</span>
                <span className="stat-label">Total Time</span>
              </div>
            </div>

            <div className="game-buttons">
              <button className="play-again-btn" onClick={resetGame}>
                Play Again
              </button>
              <button className="close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          // Game Screen
          <div className="trivia-game">
            <div className="game-header">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${((gameState.currentQuestion + 1) / gameState.questions.length) * 100}%` 
                  }}
                />
              </div>
              <div className="game-info">
                <span className="question-count">
                  Question {gameState.currentQuestion + 1} of {gameState.questions.length}
                </span>
                <span className="score">Score: {gameState.score}</span>
                <span className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                  ⏰ {timeLeft}s
                </span>
              </div>
            </div>

            {currentQ && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={gameState.currentQuestion}
                  className="question-container"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <div className="question-category">
                    📂 {currentQ.category.toUpperCase()}
                  </div>
                  <h3 className="question-text">{currentQ.question}</h3>
                  
                  <div className="answers-grid">
                    {currentQ.options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={`answer-btn ${
                          gameState.selectedAnswer === index
                            ? index === currentQ.correctAnswer
                              ? 'correct'
                              : 'incorrect'
                            : gameState.showExplanation && index === currentQ.correctAnswer
                            ? 'correct'
                            : ''
                        }`}
                        onClick={() => handleAnswer(index)}
                        disabled={gameState.showExplanation}
                        whileHover={{ scale: gameState.showExplanation ? 1 : 1.02 }}
                        whileTap={{ scale: gameState.showExplanation ? 1 : 0.98 }}
                      >
                        <span className="answer-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="answer-text">{option}</span>
                      </motion.button>
                    ))}
                  </div>

                  {gameState.showExplanation && (
                    <motion.div
                      className="explanation"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p>{currentQ.explanation}</p>
                      <button className="next-btn" onClick={nextQuestion}>
                        {gameState.currentQuestion + 1 < gameState.questions.length 
                          ? 'Next Question →' 
                          : 'See Results →'
                        }
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        <button className="close-modal-btn" onClick={onClose}>
          ✕
        </button>
      </motion.div>

    </motion.div>
  );
};

export default TriviaGame;