// Trivia questions extracted from 1980s data for interactive game
export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 'slang_1',
    question: 'What does "totally tubular" mean in 1980s slang?',
    options: ['Very boring', 'Awesome or excellent', 'Completely confused', 'Really expensive'],
    correctAnswer: 1,
    category: 'slang',
    explanation: 'Totally tubular was an iconic 80s term from surfer culture meaning awesome or excellent!',
    difficulty: 'easy'
  },
  {
    id: 'slang_2',
    question: 'Complete this 1980s phrase: "Gag me with a ___"',
    options: ['Fork', 'Spoon', 'Knife', 'Straw'],
    correctAnswer: 1,
    category: 'slang',
    explanation: '"Gag me with a spoon" was Valley Girl speak for expressing extreme disgust or annoyance.',
    difficulty: 'easy'
  },
  {
    id: 'events_1',
    question: 'Who was the U.S. President during most of the 1980s?',
    options: ['Jimmy Carter', 'Ronald Reagan', 'George Bush', 'Bill Clinton'],
    correctAnswer: 1,
    category: 'events',
    explanation: 'Ronald Reagan was president from 1981-1989, defining the decade with "Reaganomics" and conservative policies.',
    difficulty: 'easy'
  },
  {
    id: 'events_2',
    question: 'What tragic event happened to John Lennon in December 1980?',
    options: ['He retired from music', 'He was assassinated', 'He moved to Japan', 'He started a new band'],
    correctAnswer: 1,
    category: 'events',
    explanation: 'John Lennon was tragically assassinated on December 8, 1980, outside his New York apartment building.',
    difficulty: 'medium'
  },
  {
    id: 'fads_1',
    question: 'What colorful puzzle became a massive fad in 1980?',
    options: ['Tetris', 'Rubiks Cube', 'Pac-Man', 'Atari'],
    correctAnswer: 1,
    category: 'fads',
    explanation: 'The Rubiks Cube became a global obsession in 1980, challenging millions with its colorful complexity.',
    difficulty: 'easy'
  },
  {
    id: 'music_1',
    question: 'What music television network launched in 1981?',
    options: ['VH1', 'MTV', 'BET', 'CMT'],
    correctAnswer: 1,
    category: 'music',
    explanation: 'MTV (Music Television) launched in 1981 with the famous words "Ladies and gentlemen, rock and roll!"',
    difficulty: 'medium'
  },
  {
    id: 'slang_3',
    question: 'If something was "rad" in the 1980s, it was:',
    options: ['Radioactive', 'Cool or excellent', 'Red-colored', 'Ridiculous'],
    correctAnswer: 1,
    category: 'slang',
    explanation: '"Rad" was short for "radical" and meant cool or excellent in 1980s skater and surfer culture.',
    difficulty: 'easy'
  },
  {
    id: 'events_3',
    question: 'What space shuttle had its first launch in 1981?',
    options: ['Discovery', 'Columbia', 'Challenger', 'Atlantis'],
    correctAnswer: 1,
    category: 'events',
    explanation: 'Space Shuttle Columbia had its maiden flight in 1981, marking a new era of reusable spacecraft.',
    difficulty: 'medium'
  },
  {
    id: 'slang_4',
    question: 'What does "grody to the max" mean?',
    options: ['Super cool', 'Very fast', 'Extremely gross', 'Really loud'],
    correctAnswer: 2,
    category: 'slang',
    explanation: '"Grody to the max" was Valley Girl speak meaning something was supremely disgusting or gross.',
    difficulty: 'medium'
  },
  {
    id: 'culture_1',
    question: 'Which royal wedding was called the "wedding of the century" in 1981?',
    options: ['Prince Andrew & Sarah Ferguson', 'Prince Charles & Lady Diana', 'Prince Edward & Sophie', 'Prince William & Kate'],
    correctAnswer: 1,
    category: 'events',
    explanation: 'Prince Charles and Lady Diana Spencers wedding in 1981 was watched by 750 million people worldwide.',
    difficulty: 'hard'
  },
  {
    id: 'fads_2',
    question: 'What fitness craze, led by celebrities like Jane Fonda, was popular in the 1980s?',
    options: ['Yoga', 'Pilates', 'Aerobics', 'CrossFit'],
    correctAnswer: 2,
    category: 'fads',
    explanation: 'Aerobics became huge in the 1980s, with colorful leotards, leg warmers, and high-energy workouts.',
    difficulty: 'medium'
  },
  {
    id: 'slang_5',
    question: 'If you heard "Whats your damage?" in the 1980s, someone was asking:',
    options: ['How much you paid', 'Whats your problem', 'Where you got hurt', 'What you broke'],
    correctAnswer: 1,
    category: 'slang',
    explanation: '"Whats your damage?" was popularized by the movie Heathers and meant "Whats your problem?"',
    difficulty: 'hard'
  }
];

export const getQuestionsByCategory = (category: string): TriviaQuestion[] => {
  return triviaQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): TriviaQuestion[] => {
  return triviaQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number): TriviaQuestion[] => {
  const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const categories = ['slang', 'events', 'fads', 'music', 'culture'];
export const difficulties = ['easy', 'medium', 'hard'];