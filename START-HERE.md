# 🚀 Time Machine - Quick Start Guide

## Current Status
✅ **Phase 1-3**: Backend complete and operational  
✅ **Phase 4**: Frontend complete and ready to test  
🔄 **Ready for**: Full frontend-backend integration testing

## Starting the Application

### 1. Start the Backend Server
```bash
# Terminal 1 - Backend
cd backend
source ../venv/bin/activate  # Activate virtual environment
python app.py

# You should see:
# INFO:app:Time Machine API started successfully!
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Start the Frontend Server
```bash
# Terminal 2 - Frontend (new terminal window)
cd frontend
npm start

# You should see:
# Compiled successfully!
# Local: http://localhost:3000
```

### 3. Test the Application
- **Open your browser** and go to: http://localhost:3000
- **Select "1980s"** from the era dropdown
- **Start chatting** with queries like:
  - "What is the internet?"
  - "Tell me about smartphones"
  - "What's popular slang in your time?"

## Troubleshooting

### Backend Issues
- **"Port 8000 already in use"**: Kill existing process with `pkill -f "python app.py"`
- **"Module not found"**: Make sure virtual environment is activated
- **"API key errors"**: Check your `.env` file has valid OpenAI and Pinecone keys

### Frontend Issues  
- **"Port 3000 already in use"**: Choose a different port when prompted (y)
- **Compilation errors**: Run `npm install` to ensure dependencies are installed
- **"Backend not connected"**: Make sure backend is running on port 8000

### Connection Issues
- **Red status indicator**: Backend is not running or accessible
- **No responses**: Check browser console for API errors
- **Slow responses**: OpenAI API might be experiencing delays

## What You Can Test

### ✅ Working Features
1. **Era Selection** - Dropdown with 1980s locked as active
2. **Chat Interface** - Type messages and receive responses
3. **Connection Status** - Green/red indicator showing backend status
4. **Message History** - Previous messages with timestamps
5. **1980s Personality** - AI responds with Valley Girl slang and references
6. **Responsive Design** - Works on mobile and desktop
7. **Loading States** - Typing indicators while AI responds

### 🎯 Test Scenarios
1. **Modern Tech Questions**: "Explain social media" → Should get 1980s analogies
2. **Era-Specific Questions**: "What's rad slang?" → Should use authentic 1980s language
3. **Connection Testing**: Stop/start backend → Status should update
4. **Mobile Experience**: Test on phone browser → Should be fully responsive

## Architecture Overview

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   React Frontend │  ←──────────→   │  FastAPI Backend │
│  (localhost:3000) │                 │ (localhost:8000) │
└─────────────────┘                 └──────────────────┘
         │                                    │
         ├── Era Selection                    ├── RAG Pipeline
         ├── Chat Interface                  ├── OpenAI GPT-3.5
         ├── Message Display                 ├── Pinecone Vector DB
         └── API Integration                 └── 1980s Data (25 vectors)
```

## Ready for Phase 5

Once you've tested the basic functionality, the app is ready for Phase 5 enhancements:
- 🎨 **1980s Visual Theming** (neon colors, retro fonts)
- 🎵 **Audio Integration** (1980s radio streaming)
- 🎮 **Interactive Features** (trivia games, memory prompts)
- ✨ **Enhanced UX** (animations, transitions)

## Need Help?

If you encounter issues:
1. Check both terminal windows for error messages
2. Look at browser console (F12) for frontend errors
3. Verify your `.env` file has valid API keys
4. Make sure both servers are running on correct ports

**Happy time traveling! 🕰️✨**