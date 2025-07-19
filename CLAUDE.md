# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**App Name**: Time Machine

**Description**: A nostalgic AI chatbot app that lets users "time travel" to the 1980s for immersive conversations. The AI explains modern concepts through the 1980s lens, using era-appropriate analogies, slang, and cultural references to evoke childhood nostalgia.

**MVP Goals**: 
- Build a cheap, testable web-based prototype (under $100/month)
- Focus on 1980s era only to minimize scope
- Use prompt engineering and RAG (no fine-tuning)
- Eventually transition to iOS app

**Target Users**: 
- Primary: Older generations seeking nostalgia
- Secondary: Younger users for fun/education
- Focus on emotional retention (>5 minute sessions)

**Core USP**: "Era lens" filtering (e.g., explaining AI as "a radical 1980s robot from Back to the Future") combined with immersive multimedia and games.

## Tech Stack

### Backend
- **Python 3.13** with FastAPI for API server
- **LangChain** for RAG and prompt chaining
- **OpenAI GPT-3.5 Turbo** for AI chat generation
- **Pinecone** for vector database (era-specific data)
- **Sentence-Transformers** for embeddings

### Frontend
- **React.js** (Create React App)
- **Axios** for API calls
- **React-Player** for audio streaming
- **Framer Motion** for animations
- **Styled-Components/Tailwind CSS** for 1980s theming

### Data & Assets
- **Era Data**: `data/json/1980.json` - 500-1,000 snippets (slang, events, analogies)
- **Images**: `data/images/` - 1980s themed visuals (arcade, celebrities, TV shows)
- **Audio**: `data/sounds/` - Background sounds and music
- **Streaming**: 1980s radio (e.g., https://stream.80s80s.de)

## Development Commands

### Backend Setup
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
cd backend
pip install -r requirements.txt

# Upload data to Pinecone (one-time setup)
python scripts/upload_to_pinecone.py

# Run FastAPI server
python app.py
# Server will be available at http://localhost:8000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run React development server
npm start
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the internet?"}'

# Run comprehensive tests
cd backend
./test_api.sh
```

## Key Features (Implemented)

1. **🎨 1980s Immersive Theme**: Complete neon aesthetic with authentic design
2. **💬 RAG-Powered Chatbot**: AI with Valley Girl persona and 1980s knowledge
3. **🎮 Interactive Games**:
   - 🧠 Character Mind Reader: AI guesses 80s characters
   - 🎯 Trivia Challenge: Timed quiz with scoring system
   - 🔍 Find the Icons: HTML5 Canvas hidden-object game
4. **🎵 Audio Integration**: 80s radio streaming with smart controls
5. **📱 Mobile Optimization**: Touch gestures, responsive design
6. **🎯 Navigation**: Persistent header with accessible controls
7. **♿ Accessibility**: Mute controls, readable fonts, keyboard navigation

## Development Phases

**Phase 1**: Environment Setup ✅ Complete
**Phase 2**: Data Collection ✅ - 1980s content organized and uploaded to Pinecone
**Phase 3**: Backend Server ✅ - FastAPI + RAG integration with game APIs
**Phase 4**: Frontend Setup ✅ - React app with complete 1980s UI
**Phase 5**: Immersive Features ✅ - Theme, audio, 3 interactive games
**Phase 6**: Integration ✅ - Full frontend/backend connectivity
**Phase 7**: Testing 🔄 - Cross-browser, mobile optimization (ongoing)
**Phase 8**: Deployment 🔄 - Railway backend, Netlify frontend (ready)

## API Configuration

### Environment Variables (.env)
```
# Required - Add your actual API keys
OPENAI_API_KEY=sk-proj-your_openai_key_here
PINECONE_API_KEY=pcsk_your_pinecone_key_here
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=time-machine-1980s

# App Configuration
APP_ENV=development
DEBUG=true
```

### Cost Management
- Use GPT-3.5-turbo for affordability
- Monitor token usage in responses
- Cache common queries
- Use Pinecone free tier (100K vectors)

## Current Project Status

- **Phase 1-4 Complete**: Full-stack application with immersive 1980s experience
- **✅ FastAPI Server**: Running with chat, trivia, and character guessing APIs
- **✅ RAG Pipeline**: 25 vectors uploaded to Pinecone, semantic search active
- **✅ React Frontend**: Complete 1980s-themed UI with responsive design
- **✅ Interactive Games**: 3 games (Trivia, Character Guesser, Find Icons)
- **✅ Audio Integration**: 80s radio streaming with smart controls
- **✅ Mobile Support**: Touch gestures, responsive layouts, mobile optimization
- **Current Phase**: Phase 5 - Enhanced features and polish
- **Next Steps**: Social sharing, user preferences, additional games

## Important Development Notes

1. **Audio Restrictions**: Browser autoplay policies require user interaction. Implement play button fallback.

2. **RAG Implementation**: 
   - Embed 1980s snippets using sentence-transformers
   - Store in Pinecone with metadata (category, year, relevance)
   - Use similarity search for context injection

3. **1980s Persona Prompt**: 
   - Include era-specific slang (e.g., "rad", "tubular", "gag me with a spoon")
   - Reference period technology (Walkman, VHS, arcade games)
   - Use analogies to period movies/TV (Back to the Future, Miami Vice)

4. **Testing Requirements**:
   - 10-20 tester sessions minimum
   - Track session duration (target >5 minutes)
   - Test on mobile browsers for responsive design

5. **Deployment**:
   - Frontend: Vercel/Netlify free tier
   - Backend: Consider Railway or Render free tier
   - Use GitHub Actions for CI/CD

## Implemented File Structure

```
backend/
  app.py            # ✅ FastAPI server with lifecycle management
  rag.py            # ✅ RAG chain with Pinecone + OpenAI integration
  prompts.py        # ✅ 1980s Valley Girl persona and examples
  models.py         # ✅ Pydantic request/response models
  config.py         # ✅ Environment configuration management
  requirements.txt  # ✅ Updated dependencies (langchain, pinecone, etc.)
  .env             # ✅ API keys configuration
  test_api.sh      # ✅ Endpoint testing script
  scripts/
    upload_to_pinecone.py  # ✅ Data upload pipeline
    test_embeddings.py     # ✅ Embedding validation
frontend/
  src/
    components/     # 🔄 React components (Phase 4)
    services/       # 🔄 API calls (Phase 4)
    styles/         # 🔄 1980s theme CSS (Phase 5)
data/
  json/1980.json    # ✅ Era-specific data with radio config
  images/           # ✅ 1980s themed visuals
  sounds/           # ✅ Audio files and synthwave music
```

## Success Metrics

- Stable app with no critical bugs
- Average session time >5 minutes
- Successful 1980s knowledge retrieval
- Immersive audio/visual experience
- Positive tester feedback on nostalgia factor