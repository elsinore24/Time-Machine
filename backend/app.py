# Import necessary libraries for FastAPI and LangChain
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import uvicorn
from typing import Dict

# Import local modules
from config import config
from models import (
    ChatRequest, ChatResponse, HealthResponse, ErrorResponse,
    CharacterGuessGameStart, CharacterGuessGameStartResponse,
    CharacterGuessAnswer, CharacterGuessResponse, CharacterGuessGameEnd
)
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

# Character Guessing Game Endpoints

# Global storage for active games (in production, use Redis or database)
active_games: Dict[str, Dict] = {}

@app.post("/guess-game/start", response_model=CharacterGuessGameStartResponse)
async def start_character_guess_game(request: CharacterGuessGameStart):
    """
    Start a new character guessing game.
    
    The AI will think of a 1980s character and ask yes/no questions
    to narrow down the possibilities until it can make a confident guess.
    """
    try:
        import json
        import uuid
        import os
        from pathlib import Path
        
        # Generate unique game ID
        game_id = f"game_{uuid.uuid4().hex[:8]}"
        
        # Load character database
        characters_file = Path(__file__).parent / "data" / "characters_80s.json"
        if not characters_file.exists():
            raise HTTPException(status_code=500, detail="Character database not found")
            
        with open(characters_file, 'r') as f:
            characters = json.load(f)
        
        # Initialize game state
        game_state = {
            "characters_remaining": characters.copy(),
            "questions_asked": [],
            "attributes_known": {},
            "question_count": 0,
            "max_questions": 20,
            "target_character": None  # AI doesn't know the target, user thinks of one
        }
        
        # Store game state
        active_games[game_id] = game_state
        
        # Generate first question using AI logic
        first_question = generate_strategic_question(game_state)
        game_state["questions_asked"].append(first_question)
        
        response = CharacterGuessGameStartResponse(
            game_id=game_id,
            message="I'm thinking of an iconic character from the 1980s! Think of someone from that radical decade, and I'll try to guess who it is by asking yes or no questions. Ready to play?",
            first_question=first_question["question"],
            characters_remaining=len(characters)
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error starting character guess game: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/guess-game/answer", response_model=CharacterGuessResponse)
async def answer_character_guess_question(request: CharacterGuessAnswer):
    """
    Submit an answer to the AI's question in the character guessing game.
    
    The AI will process your yes/no answer and either ask another question
    or make a final guess if confident enough.
    """
    try:
        # Retrieve game state
        if request.game_id not in active_games:
            raise HTTPException(status_code=404, detail="Game not found")
        
        game_state = active_games[request.game_id]
        
        # Process the answer and filter characters
        last_question = game_state["questions_asked"][-1] if game_state["questions_asked"] else None
        if not last_question:
            raise HTTPException(status_code=400, detail="No question to answer")
        
        # Filter characters based on the answer
        filtered_characters = filter_characters_by_answer(
            game_state["characters_remaining"],
            last_question,
            request.answer
        )
        
        game_state["characters_remaining"] = filtered_characters
        game_state["question_count"] += 1
        game_state["attributes_known"][last_question["attribute"]] = request.answer
        
        # Check if we should make a final guess
        characters_count = len(filtered_characters)
        confidence = calculate_confidence(characters_count, game_state["question_count"])
        
        if characters_count <= 1 or confidence >= 0.8 or game_state["question_count"] >= game_state["max_questions"]:
            # Make final guess
            if characters_count > 0:
                final_guess = filtered_characters[0]["name"]
                ai_message = f"I think I know who you're thinking of! Is it {final_guess}?"
            else:
                final_guess = "Unknown Character"
                ai_message = "Hmm, I can't seem to narrow it down to a specific character. You've stumped me this time!"
            
            response = CharacterGuessResponse(
                game_id=request.game_id,
                next_question=None,
                final_guess=final_guess,
                characters_remaining=characters_count,
                game_complete=True,
                ai_message=ai_message,
                confidence=confidence
            )
        else:
            # Ask another question
            next_question = generate_strategic_question(game_state)
            game_state["questions_asked"].append(next_question)
            
            ai_message = get_encouraging_message(characters_count, game_state["question_count"])
            
            response = CharacterGuessResponse(
                game_id=request.game_id,
                next_question=next_question["question"],
                final_guess=None,
                characters_remaining=characters_count,
                game_complete=False,
                ai_message=ai_message,
                confidence=confidence
            )
        
        # Update game state
        active_games[request.game_id] = game_state
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing character guess answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/guess-game/end")
async def end_character_guess_game(request: CharacterGuessGameEnd):
    """
    End or restart a character guessing game.
    
    Optionally collect user feedback about the game experience.
    """
    try:
        if request.game_id in active_games:
            if request.action == "restart":
                # Clear game state but keep the ID for new game
                del active_games[request.game_id]
                return {"message": "Game restarted! Start a new game when ready."}
            else:
                # End game and clean up
                del active_games[request.game_id]
                
                # Log feedback if provided
                if request.user_feedback:
                    logger.info(f"Game feedback for {request.game_id}: {request.user_feedback}")
                
                return {"message": "Thanks for playing! Your feedback has been recorded."}
        else:
            return {"message": "Game not found or already ended."}
            
    except Exception as e:
        logger.error(f"Error ending character guess game: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions for character guessing game logic

def generate_strategic_question(game_state: Dict) -> Dict:
    """Generate the most strategic question to narrow down characters"""
    characters = game_state["characters_remaining"]
    
    if not characters:
        return {"question": "Is your character real?", "attribute": "is_real"}
    
    # Find the attribute that best splits the remaining characters
    best_attribute = None
    best_split_score = -1
    
    # Get all possible attributes from the first character
    if len(characters) > 0:
        possible_attributes = characters[0]["attributes"].keys()
        
        for attr in possible_attributes:
            if attr in game_state["attributes_known"]:
                continue  # Skip already asked attributes
                
            true_count = sum(1 for char in characters if char["attributes"].get(attr, False))
            false_count = len(characters) - true_count
            
            # Best split is closest to 50/50
            split_score = min(true_count, false_count) / max(true_count, false_count, 1)
            
            if split_score > best_split_score:
                best_split_score = split_score
                best_attribute = attr
    
    # Convert attribute to natural question
    if best_attribute:
        question_text = attribute_to_question(best_attribute)
        return {"question": question_text, "attribute": best_attribute}
    else:
        # Fallback question
        return {"question": "Is your character human?", "attribute": "is_human"}

def attribute_to_question(attribute: str) -> str:
    """Convert attribute name to natural language question"""
    question_mapping = {
        "is_real": "Is your character a real person?",
        "is_human": "Is your character human?",
        "is_from_movie": "Did your character appear in movies?",
        "is_from_tv": "Did your character appear on TV?",
        "is_alien": "Is your character an alien?",
        "is_robot": "Is your character a robot?",
        "is_musician": "Is your character a musician?",
        "is_villain": "Is your character a villain?",
        "fights_evil": "Does your character fight against evil?",
        "is_magical": "Does your character have magical abilities?",
        "is_small": "Is your character small in size?",
        "is_friendly": "Is your character friendly?",
        "has_special_powers": "Does your character have special powers?",
        "is_famous_in_80s": "Was your character famous in the 1980s?"
    }
    
    return question_mapping.get(attribute, f"Does your character have the attribute: {attribute}?")

def filter_characters_by_answer(characters: list, question: Dict, answer: bool) -> list:
    """Filter characters based on the user's answer"""
    attribute = question["attribute"]
    
    filtered = []
    for char in characters:
        char_value = char["attributes"].get(attribute, False)
        if char_value == answer:
            filtered.append(char)
    
    return filtered

def calculate_confidence(characters_remaining: int, questions_asked: int) -> float:
    """Calculate AI confidence based on remaining characters and questions asked"""
    if characters_remaining <= 1:
        return 0.95
    elif characters_remaining <= 3:
        return 0.8
    elif characters_remaining <= 5:
        return 0.6
    elif characters_remaining <= 10:
        return 0.4
    else:
        return max(0.1, questions_asked / 20.0)

def get_encouraging_message(characters_remaining: int, questions_asked: int) -> str:
    """Generate encouraging AI message based on game progress"""
    messages = {
        "high": [
            "Excellent! That really narrows it down!",
            "Great answer! I'm getting closer!",
            "Perfect! The pieces are falling into place!",
        ],
        "medium": [
            "Interesting! That gives me some good clues!",
            "Good to know! I'm starting to get a better picture!",
            "That helps! Let me think about this...",
        ],
        "low": [
            "Hmm, still quite a few possibilities!",
            "I need to ask more specific questions!",
            "This is challenging! Let me try a different approach!",
        ]
    }
    
    import random
    
    if characters_remaining <= 5:
        return random.choice(messages["high"])
    elif characters_remaining <= 15:
        return random.choice(messages["medium"])
    else:
        return random.choice(messages["low"])

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
        "rag_chain_initialized": rag_chain is not None,
        "active_games": len(active_games)
    }

# Run the server if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG
    )