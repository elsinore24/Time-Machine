# 🕰️ Time Machine - 1980s Nostalgia AI Experience

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://github.com/elsinore24/Time-Machine)
[![Frontend](https://img.shields.io/badge/frontend-React%2018-61dafb)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--3.5-412991)](https://openai.com/)

> **Travel back to the totally radical 1980s!** Experience an immersive AI chatbot that explains modern concepts through the lens of the 1980s, complete with authentic slang, cultural references, and interactive games.

## 🌟 Features

### 💬 **AI-Powered 1980s Chatbot**
- **RAG-Enhanced Responses**: Powered by Pinecone vector database with 1980s-specific knowledge
- **Authentic Valley Girl Persona**: "Like, totally rad!" conversations with period-appropriate slang
- **Modern Concept Translation**: Explains today's technology using 1980s analogies
- **Conversation Memory**: Maintains context throughout your time-travel session

### 🎮 **Interactive Games**
- **🧠 AI Character Mind Reader**: Think of an 80s character, AI asks questions to guess who it is
- **🎯 1980s Trivia Challenge**: Test your knowledge with radical decade questions
- **🔍 Find the Icons**: Hidden-object game featuring classic 80s items (Walkman, Rubik's Cube, etc.)

### 🎵 **Immersive Audio Experience**
- **80s Radio Stream**: Background music from the tubular decade
- **Smart Controls**: Auto-play with user-friendly mute/unmute options
- **Mobile Optimized**: Works seamlessly across all devices

### 🎨 **Authentic 1980s Design**
- **Neon Aesthetic**: Cyan, magenta, and green color schemes
- **Retro Typography**: Orbitron font for that futuristic 80s feel
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for rad transitions

### 🎯 **User Experience**
- **Persistent Navigation**: Header with controls always accessible during games
- **Session Persistence**: Chat history maintained throughout your visit
- **Loading States**: Smooth transitions and feedback
- **Touch Support**: Full mobile gesture support (pan, zoom, tap)

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8+)
- **OpenAI API Key**
- **Pinecone API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/elsinore24/Time-Machine.git
cd Time-Machine
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Add your OpenAI and Pinecone API keys to .env

# Upload 1980s data to Pinecone (one-time setup)
python scripts/upload_to_pinecone.py

# Start the backend server
python app.py
# Server runs at http://localhost:8000
```

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend
npm install

# Start the React development server
npm start
# App opens at http://localhost:3000
```

### 4. Start Your Time Travel Journey! 🎉
- Open http://localhost:3000 in your browser
- Experience the radical 1980s interface
- Try asking: "What is social media?" or "Tell me about smartphones"
- Play the interactive games and enjoy the 80s tunes!

## 🎮 Game Features

### 🧠 **Character Mind Reader**
The AI thinks of 1980s icons and tries to guess your character through strategic yes/no questions:
- **20+ 1980s Characters**: From E.T. to Madonna, Pac-Man to Mr. T
- **Smart Algorithm**: AI uses attribute filtering for strategic questioning
- **Confidence System**: Shows AI's certainty as it narrows down possibilities
- **Mobile Friendly**: Optimized touch interface

### 🎯 **Trivia Challenge**
Test your 1980s knowledge with an interactive quiz game:
- **5 Questions Per Round**: Covering music, movies, technology, and culture
- **Time Pressure**: 30 seconds per question with speed bonuses
- **Scoring System**: Points for correct answers plus time bonuses
- **Streak Tracking**: Build combos for maximum rad points
- **Explanations**: Learn fascinating 80s facts after each answer

### 🔍 **Find the Icons Game**
HTML5 Canvas hidden-object game with authentic 80s scenes:
- **3 Themed Levels**: 
  - 🕹️ Rad 80s Arcade
  - 🌴 Miami Vice Scene  
  - 🎬 80s Movie Night
- **Pan & Zoom**: Mouse and touch controls for exploration
- **Hidden Objects**: Find Walkmans, Rubik's Cubes, boomboxes, and more
- **Nostalgic Explanations**: Learn the cultural significance of each item
- **Mobile Gestures**: Pinch-to-zoom and touch panning support

## 🏗️ Architecture

```
┌─────────────────────┐    HTTP/REST API    ┌─────────────────────┐
│   React Frontend    │ ←─────────────────→ │   FastAPI Backend   │
│   (localhost:3000)  │                     │  (localhost:8000)   │
└─────────────────────┘                     └─────────────────────┘
         │                                            │
         ├── 🎨 1980s UI Theme                       ├── 🤖 RAG Pipeline
         ├── 🎮 Interactive Games                    ├── 🧠 OpenAI GPT-3.5
         ├── 🎵 Audio Controller                     ├── 📊 Pinecone Vector DB
         ├── 💬 Chat Interface                       ├── 🎯 Game Logic APIs
         └── 📱 Responsive Design                    └── 🔍 1980s Knowledge Base
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for robust component development
- **Framer Motion** for smooth animations and transitions
- **HTML5 Canvas** for interactive game rendering
- **React Router** for seamless navigation
- **Axios** for API communication
- **CSS3** with custom 1980s styling

### Backend
- **FastAPI** for high-performance API development
- **LangChain** for RAG (Retrieval-Augmented Generation)
- **OpenAI GPT-3.5 Turbo** for intelligent chat responses
- **Pinecone** vector database for 1980s knowledge storage
- **Python 3.8+** with async/await support

### AI & Data
- **25+ 1980s Knowledge Vectors** in Pinecone
- **Sentence Transformers** for semantic embeddings
- **Custom Game Databases** (characters, trivia, hidden objects)
- **Conversation Memory** for contextual responses

## 📁 Project Structure

```
Time-Machine/
├── 📂 backend/
│   ├── app.py                 # FastAPI server with game endpoints
│   ├── rag.py                 # RAG pipeline with Pinecone integration
│   ├── models.py              # Pydantic models for all APIs
│   ├── config.py              # Environment configuration
│   ├── data/
│   │   └── characters_80s.json # Character database for guessing game
│   └── scripts/
│       └── upload_to_pinecone.py
├── 📂 frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── audio/         # Audio controller components
│   │   │   ├── games/         # Interactive game components
│   │   │   │   ├── TriviaGame.tsx
│   │   │   │   ├── CharacterGuesser.tsx
│   │   │   │   └── FindIconGame.tsx
│   │   │   └── theme/         # 1980s theming system
│   │   ├── data/
│   │   │   ├── triviaQuestions.ts
│   │   │   └── findGameLevels.ts
│   │   ├── pages/
│   │   │   └── Era1980sPage.tsx
│   │   └── services/
│   │       └── api.ts         # Backend API integration
├── 📂 data/
│   ├── json/1980.json         # 1980s knowledge base
│   └── images/                # 80s themed visuals
├── CLAUDE.md                  # Development guidance
├── START-HERE.md              # Quick start guide
└── README.md                  # This file
```

## 🎯 API Endpoints

### Chat & Core
- `GET /health` - Health check
- `POST /chat` - AI conversation endpoint
- `GET /` - API information

### Character Guessing Game
- `POST /guess-game/start` - Initialize new game
- `POST /guess-game/answer` - Submit yes/no answer
- `POST /guess-game/end` - End/restart game

### Trivia & Games
- Trivia questions served from frontend data
- Find Icons game levels with coordinate mapping
- Touch gesture support for mobile gaming

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Required API Keys
OPENAI_API_KEY=sk-proj-your_openai_key_here
PINECONE_API_KEY=pcsk_your_pinecone_key_here
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=time-machine-1980s

# Application Settings
APP_ENV=development
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Testing
```bash
# Run API health check
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the internet?", "session_id": "test123"}'

# Test character guessing game
./test-integration.sh
```

### Frontend Testing
```bash
cd frontend
npm test                    # Run unit tests
npm run build              # Test production build
npx tsc --noEmit          # TypeScript check
```

## 🚀 Deployment

### Frontend (Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

### Backend (Railway/Render)
```bash
# Configured with railway.toml and Procfile
# Push to GitHub and connect to Railway/Render
```

## 📊 Performance & Costs

### Cost Optimization
- **GPT-3.5 Turbo**: ~$0.002 per conversation
- **Pinecone Free Tier**: 100K vectors included
- **Frontend**: Static hosting (free)
- **Backend**: Railway free tier or pay-as-you-go

### Performance Features
- **Caching**: Common query responses cached
- **Lazy Loading**: Components and images loaded on demand
- **Optimized Images**: Compressed assets for faster loading
- **Mobile-First**: Responsive design principles

## 🎨 Design Philosophy

### 1980s Aesthetic
- **Neon Color Palette**: Cyan (#00ffff), Magenta (#ff1493), Green (#39ff14)
- **Typography**: Orbitron font for futuristic retro feel
- **Gradients**: Linear gradients mimicking 80s design trends
- **Animations**: Subtle glow effects and smooth transitions

### User Experience
- **Accessibility**: Mute controls, readable fonts, keyboard navigation
- **Mobile-First**: Touch-friendly controls and responsive layouts
- **Feedback**: Clear loading states and success animations
- **Consistency**: Unified design language across all components

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/rad-new-feature`
3. **Commit changes**: `git commit -m "Add totally rad feature"`
4. **Push to branch**: `git push origin feature/rad-new-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and TypeScript types
- Test all new features on mobile devices
- Maintain 1980s theme consistency
- Add appropriate error handling
- Update documentation for new features

## 📝 Changelog

### Latest Updates (v1.2.0)
- ✅ **Added Find the Icons Game**: HTML5 Canvas hidden-object game
- ✅ **Header Navigation Preservation**: All games now preserve top navigation
- ✅ **Touch Gesture Support**: Full mobile pan/zoom/tap functionality
- ✅ **Game Button Layout**: Optimized trio layout for all three games
- ✅ **Mobile Responsive**: Enhanced mobile experience across all features

### Previous Updates (v1.1.0)
- ✅ **Character Mind Reader Game**: AI-powered guessing game
- ✅ **1980s Trivia Challenge**: Interactive quiz with scoring
- ✅ **Audio Streaming**: Background 80s radio integration
- ✅ **Theme System**: Complete 1980s visual overhaul
- ✅ **Multi-page Navigation**: React Router implementation

## 🎯 Roadmap

### Phase 5: Enhanced Features (In Progress)
- [ ] **Social Sharing**: Share favorite AI responses
- [ ] **User Preferences**: Customizable experience settings
- [ ] **More Games**: Additional 80s-themed mini-games
- [ ] **Audio Library**: Expanded music and sound effects

### Phase 6: Mobile App
- [ ] **React Native**: iOS and Android app development
- [ ] **Offline Mode**: Cached responses for limited connectivity
- [ ] **Push Notifications**: Daily 80s facts and trivia
- [ ] **Social Features**: Share progress and high scores

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-3.5 Turbo API
- **Pinecone** for vector database hosting
- **80s Culture** for endless inspiration
- **React Community** for amazing libraries
- **FastAPI** for excellent Python web framework

---

**Ready to travel back to the totally radical 1980s?** 🕰️✨

[**🚀 Start Your Journey →**](http://localhost:3000)

*Like, totally built with love for the awesome decade that was the 1980s! 💖*