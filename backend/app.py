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
        # Debug: Check environment variables before validation
        import os
        logger.info(f"Debug - All env vars: {list(os.environ.keys())}")
        logger.info(f"Debug - OPENAI_API_KEY set: {bool(os.getenv('OPENAI_API_KEY'))}")
        logger.info(f"Debug - PINECONE_API_KEY set: {bool(os.getenv('PINECONE_API_KEY'))}")
        logger.info(f"Debug - PINECONE_ENVIRONMENT set: {bool(os.getenv('PINECONE_ENVIRONMENT'))}")
        logger.info(f"Debug - Railway PORT: {os.getenv('PORT', 'not set')}")
        logger.info(f"Debug - Railway URL: {os.getenv('RAILWAY_PUBLIC_DOMAIN', 'not set')}")
        
        # Validate configuration
        try:
            config.validate()
            
            # Initialize RAG chain
            global rag_chain
            rag_chain = RAGChain()
            await rag_chain.initialize()
        except ValueError as e:
            logger.warning(f"Configuration validation failed: {str(e)}")
            logger.warning("Running in LIMITED MODE - Chat functionality will not work!")
            # Don't initialize RAG chain if config is invalid
            rag_chain = None
        
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

@app.get("/debug/env")
async def debug_env():
    """Debug endpoint to check environment variables (remove in production)"""
    import os
    return {
        "openai_key_set": bool(os.getenv("OPENAI_API_KEY")),
        "pinecone_key_set": bool(os.getenv("PINECONE_API_KEY")),
        "pinecone_env_set": bool(os.getenv("PINECONE_ENVIRONMENT")),
        "openai_key_length": len(os.getenv("OPENAI_API_KEY", "")),
        "pinecone_key_length": len(os.getenv("PINECONE_API_KEY", "")),
        "pinecone_env_value": os.getenv("PINECONE_ENVIRONMENT", "not_set"),
        "allowed_origins": config.ALLOWED_ORIGINS,
        "port": config.API_PORT,
        "rag_chain_initialized": rag_chain is not None
    }

# Run the server if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG
    )