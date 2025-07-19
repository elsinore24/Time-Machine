# Time Machine Frontend

React-based chat interface for the Time Machine 1980s nostalgic AI chatbot.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   - Visit http://localhost:3000
   - The app will automatically reload if you make changes

## Features

### ✅ Implemented (Phase 4)
- **Chat Interface** - Send messages and receive AI responses
- **Era Selection** - Dropdown locked to 1980s (expandable later)
- **Real-time Communication** - Connects to FastAPI backend
- **Message History** - View conversation with timestamps
- **Connection Status** - Shows backend connectivity
- **Responsive Design** - Works on desktop and mobile
- **Loading States** - Typing indicators and disabled states

### 🔄 Coming Soon (Phase 5)
- **1980s Theming** - Neon colors, retro fonts, arcade aesthetics
- **Audio Integration** - Background 1980s radio streaming
- **Interactive Elements** - Trivia games and memory prompts
- **Enhanced UX** - Smooth animations and transitions

## Architecture

```
src/
├── components/
│   ├── App.tsx              # Main app with era selection
│   ├── ChatInterface.tsx    # Chat UI with message handling
│   ├── MessageBubble.tsx    # Individual message display
│   └── EraSelector.tsx      # Era dropdown component
├── services/
│   └── api.ts              # Backend API communication
├── types/
│   └── index.ts            # TypeScript interfaces
└── App.css                 # Component styling
```

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

- **Health Check:** `GET /health`
- **Chat Messages:** `POST /chat`
- **Server Info:** `GET /`

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

### Backend Requirements

Make sure the backend server is running:
```bash
cd ../backend
python app.py
```

## Usage

1. **Select Era:** Choose "1980s" from the dropdown
2. **Start Chatting:** Type questions about the 1980s
3. **Get Responses:** Receive answers in authentic 1980s style

### Example Queries

- "What is the internet?"
- "Tell me about smartphones"
- "What's popular slang in your time?"
- "Explain social media"

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Adding New Features

1. **New Components:** Add to `src/components/`
2. **API Methods:** Extend `src/services/api.ts`
3. **Types:** Update `src/types/index.ts`
4. **Styling:** Modify `src/App.css`

## Troubleshooting

### Common Issues

1. **"Backend not connected"**
   - Ensure backend server is running on port 8000
   - Check API URL in environment variables

2. **Compilation errors**
   - Delete `node_modules` and run `npm install`
   - Check for TypeScript errors in components

3. **Styling issues**
   - Clear browser cache
   - Check CSS class names match components

### Testing the Integration

Use the test script from the project root:
```bash
./test-integration.sh
```

## Next Steps

After Phase 4 completion, the frontend is ready for Phase 5 enhancements:
- 1980s visual theming
- Audio streaming integration  
- Interactive games and features
- Animation improvements