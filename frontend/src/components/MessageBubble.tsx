// Individual message bubble component for chat interface
import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-bubble ${message.isUser ? 'user' : 'ai'}`}>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {message.isUser ? '🧑‍💻 You' : '🤖 1980s Time Traveler'}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="message-text">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;