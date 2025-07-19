// TypeScript interfaces for Time Machine app

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  sources?: Array<{
    id: string;
    text: string;
    category: string;
  }>;
  timestamp: string;
}

export interface ChatRequest {
  query: string;
  session_id?: string;
}

export interface ApiError {
  error: string;
  detail?: string;
  timestamp: string;
}

export interface EraConfig {
  name: string;
  value: string;
  description: string;
  isActive: boolean;
}