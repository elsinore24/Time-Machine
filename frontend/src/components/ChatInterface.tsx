// Main chat interface component with input and message display
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TimeMachineAPI from '../services/api';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  selectedEra: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedEra }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isHealthy = await TimeMachineAPI.healthCheck();
      setConnectionStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  // Add welcome message when era is selected
  useEffect(() => {
    if (selectedEra === '1980s' && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: "Oh my gosh, hi there! Welcome to the 1980s! I'm like, totally excited to chat with you! Ask me anything about the rad decade - from gnarly tech to tubular music. Let's have a totally awesome conversation! 🌈✨",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedEra, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await TimeMachineAPI.sendMessage({
        query: userMessage.text,
        session_id: sessionId || undefined
      });

      // Update session ID if provided
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
      }

      const aiMessage: ChatMessage = {
        id: response.session_id + '-' + Date.now(),
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        text: `Oops! ${error.message || 'Something went wrong. Like, totally bummer!'} 😵`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="chat-interface">
      {/* Connection Status */}
      <div className={`connection-status ${connectionStatus}`}>
        <span className="status-indicator"></span>
        <span className="status-text">
          {connectionStatus === 'connected' && '🟢 Time Machine Connected'}
          {connectionStatus === 'disconnected' && '🔴 Time Machine Offline'}
          {connectionStatus === 'checking' && '🟡 Connecting to Time Machine...'}
        </span>
        {connectionStatus === 'disconnected' && (
          <button onClick={checkConnection} className="retry-button">
            Retry
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-chat">
            <h3>🕰️ Welcome to the Time Machine!</h3>
            <p>Select the 1980s era above to start your totally rad conversation!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="typing-indicator">
            <div className="message-bubble ai">
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">🤖 1980s Time Traveler</span>
                </div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedEra === '1980s' 
                ? "Ask about the 1980s... like, what's the internet?" 
                : "Select an era to start chatting!"
            }
            disabled={isLoading || selectedEra !== '1980s'}
            className="chat-input"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || selectedEra !== '1980s'}
            className="send-button"
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>
        <div className="input-hint">
          {selectedEra === '1980s' && 'Press Enter to send • Try asking about technology, music, or slang!'}
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;