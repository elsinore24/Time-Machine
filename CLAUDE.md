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

## Key Features (MVP)

1. **Era Selection**: Locked to 1980s, triggers immersive theme
2. **Chatbot Core**: RAG-powered AI with 1980s persona
3. **Immersive Elements**:
   - Visual: Neon UI, pixel fonts, arcade backgrounds
   - Audio: Auto-play streaming radio with controls
   - Interactions: Simple trivia game with rewards
4. **Accessibility**: Mute audio, large fonts
5. **Shareable**: Copy/share responses

## Development Phases

Currently implementing 8-phase plan:

**Phase 1**: Environment Setup ✓
**Phase 2**: Data Collection ✓ - 1980s content organized and uploaded to Pinecone
**Phase 3**: Backend Server ✓ - FastAPI + RAG integration complete and running
**Phase 4**: Frontend Setup (current) - React app with chat UI
**Phase 5**: Immersive Features - Theme, audio, trivia
**Phase 6**: Integration - Connect frontend/backend
**Phase 7**: Testing - Cross-browser, performance
**Phase 8**: Deployment - Vercel/Netlify

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

- **Phase 1-3 Complete**: Backend fully operational with RAG-powered 1980s AI chatbot
- **✅ FastAPI Server**: Running on http://0.0.0.0:8000 with health monitoring
- **✅ RAG Pipeline**: 25 vectors uploaded to Pinecone, semantic search active
- **✅ 1980s Character**: Authentic Valley Girl persona with era-appropriate responses
- **✅ OpenAI Integration**: GPT-3.5-turbo with conversation memory and cost monitoring
- **Current Phase**: Ready for Phase 4 - React frontend development
- **Next Steps**: Build React chat interface and connect to backend API

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