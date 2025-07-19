# Time Machine Backend

FastAPI backend for the Time Machine 1980s nostalgic chatbot.

## Setup Instructions

### 1. Install Dependencies

```bash
# Activate virtual environment
source ../venv/bin/activate  # macOS/Linux
# or
..\venv\Scripts\activate  # Windows

# Install required packages
pip install -r requirements.txt
```

### 2. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PINECONE_API_KEY`: Your Pinecone API key
   - `PINECONE_ENVIRONMENT`: Your Pinecone environment (e.g., "us-west1-gcp")

### 3. Upload Data to Pinecone

Before running the server, upload the 1980s data to Pinecone:

```bash
python scripts/upload_to_pinecone.py
```

This will:
- Load data from `test.py` and `data/json/1980.json`
- Generate embeddings using sentence-transformers
- Upload vectors to your Pinecone index

### 4. Test Embeddings (Optional)

To test that embeddings and Pinecone queries work:

```bash
python scripts/test_embeddings.py
```

### 5. Run the Server

```bash
# Run with auto-reload (development)
python app.py

# Or use uvicorn directly
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

### 6. Test the API

Use the provided test script:

```bash
./test_api.sh
```

Or test manually with curl:

```bash
# Health check
curl http://localhost:8000/health

# Chat with the 1980s AI
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the internet?"}'
```

## API Endpoints

- `GET /` - Welcome message and endpoint list
- `GET /health` - Health check
- `POST /chat` - Main chat endpoint
- `GET /docs` - Interactive API documentation

## Features

- **1980s Persona**: AI responds with Valley Girl slang and 80s references
- **RAG Integration**: Uses Pinecone to retrieve relevant 1980s context
- **Session Management**: Maintains conversation history per session
- **Cost Monitoring**: Tracks OpenAI token usage

## Troubleshooting

1. **Import Errors**: Make sure you're in the virtual environment
2. **API Key Errors**: Check that your `.env` file has valid keys
3. **Pinecone Errors**: Ensure your index exists and matches the name in `.env`
4. **No Data Retrieved**: Run the upload script first

## Next Steps

After the backend is running:
1. Proceed to Phase 4: Build the React frontend
2. Test the chat responses for 1980s authenticity
3. Monitor token usage to stay within budget