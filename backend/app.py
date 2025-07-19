# Import necessary libraries for FastAPI and LangChain
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import uvicorn
from typing import Dict

# Import local modules
from config import config
from models import ChatRequest, ChatResponse, HealthResponse, ErrorResponse
from rag import RAGChain

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global RAG chain instance
rag_chain = None

# Lifecycle management for the app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Time Machine API...")
    try:
        # Validate configuration
        config.validate()
        
        # Initialize RAG chain
        global rag_chain
        rag_chain = RAGChain()
        await rag_chain.initialize()
        
        logger.info("Time Machine API started successfully!")
    except Exception as e:
        logger.error(f"Failed to start API: {str(e)}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Time Machine API...")

# Create FastAPI app with custom configuration
app = FastAPI(
    title="Time Machine API",
    description="Travel back to the 1980s with our nostalgic AI chatbot",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the API is running and healthy"""
    return HealthResponse(status="healthy", version="1.0.0")

# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the 1980s AI character
    
    This endpoint takes a user query and returns a response from our 1980s
    time traveler character, complete with era-appropriate slang and references.
    """
    try:
        # Validate RAG chain is initialized
        if not rag_chain:
            raise HTTPException(status_code=503, detail="Service not ready")
        
        # Get response from RAG chain
        result = await rag_chain.get_response(
            query=request.query,
            session_id=request.session_id
        )
        
        # Create response
        response = ChatResponse(
            response=result["response"],
            session_id=result["session_id"],
            sources=result.get("sources", [])
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Error handler for validation errors
@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    return ErrorResponse(
        error="Validation Error",
        detail=str(exc)
    )

# Root endpoint
@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to the Time Machine API! Ready to travel back to the 1980s?",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "docs": "/docs"
        }
    }

# Run the server if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG
    )