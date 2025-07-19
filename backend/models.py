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