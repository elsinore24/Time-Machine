# Pydantic models for request/response validation
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

# Request model for chat endpoint
class ChatRequest(BaseModel):
    query: str = Field(..., description="User's question or message")
    session_id: Optional[str] = Field(None, description="Session ID for conversation continuity")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "What's the internet?",
                "session_id": "user123"
            }
        }

# Response model for chat endpoint
class ChatResponse(BaseModel):
    response: str = Field(..., description="AI's 1980s-styled response")
    session_id: str = Field(..., description="Session ID for conversation continuity")
    sources: Optional[List[Dict[str, str]]] = Field(None, description="Source snippets used for response")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Oh wow, the internet? That's like, totally rad! Imagine if your computer could talk to other computers through phone lines...",
                "session_id": "user123",
                "sources": [
                    {
                        "id": "snippet1",
                        "text": "Totally tubular: An iconic 80s slang term...",
                        "category": "slang"
                    }
                ],
                "timestamp": "2024-01-17T10:30:00"
            }
        }

# Health check response model
class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    version: str = Field(default="1.0.0", description="API version")
    timestamp: datetime = Field(default_factory=datetime.now)

# Error response model
class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    timestamp: datetime = Field(default_factory=datetime.now)

# Character Guessing Game Models

class CharacterGuessGameStart(BaseModel):
    """Request to start a new character guessing game"""
    session_id: Optional[str] = Field(None, description="Session ID for game continuity")
    
    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "game123"
            }
        }

class CharacterGuessGameStartResponse(BaseModel):
    """Response when starting a new character guessing game"""
    game_id: str = Field(..., description="Unique game session identifier")
    message: str = Field(..., description="Welcome message from the AI")
    first_question: str = Field(..., description="The first question to narrow down the character")
    characters_remaining: int = Field(..., description="Number of possible characters remaining")
    
    class Config:
        json_schema_extra = {
            "example": {
                "game_id": "game_abc123",
                "message": "I'm thinking of an iconic character from the 1980s! Answer yes or no to my questions and I'll try to guess who you're thinking of!",
                "first_question": "Is your character a real person?",
                "characters_remaining": 20
            }
        }

class CharacterGuessAnswer(BaseModel):
    """User's answer to a guessing question"""
    game_id: str = Field(..., description="Game session identifier")
    answer: bool = Field(..., description="True for yes, False for no")
    
    class Config:
        json_schema_extra = {
            "example": {
                "game_id": "game_abc123",
                "answer": True
            }
        }

class CharacterGuessResponse(BaseModel):
    """AI's response to user's answer"""
    game_id: str = Field(..., description="Game session identifier")
    next_question: Optional[str] = Field(None, description="Next question to ask, if game continues")
    final_guess: Optional[str] = Field(None, description="Final character guess if AI is confident")
    characters_remaining: int = Field(..., description="Number of possible characters remaining")
    game_complete: bool = Field(..., description="Whether the game has ended")
    ai_message: str = Field(..., description="AI's response message")
    confidence: float = Field(..., description="AI's confidence level (0.0 to 1.0)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "game_id": "game_abc123",
                "next_question": "Is your character from a movie?",
                "final_guess": None,
                "characters_remaining": 12,
                "game_complete": False,
                "ai_message": "Interesting! That narrows it down quite a bit.",
                "confidence": 0.3
            }
        }

class CharacterGuessGameEnd(BaseModel):
    """Request to end or restart the guessing game"""
    game_id: str = Field(..., description="Game session identifier")
    action: str = Field(..., description="Action to take: 'restart' or 'end'")
    user_feedback: Optional[str] = Field(None, description="Optional feedback about the game")
    
    class Config:
        json_schema_extra = {
            "example": {
                "game_id": "game_abc123",
                "action": "restart",
                "user_feedback": "Great game! The questions were really clever."
            }
        }