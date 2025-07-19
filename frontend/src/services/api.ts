// API service for Time Machine backend communication
import axios, { AxiosResponse } from 'axios';
import { ChatRequest, ChatResponse, ApiError } from '../types';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export class TimeMachineAPI {
  // Health check endpoint
  static async healthCheck(): Promise<boolean> {
    try {
      const response: AxiosResponse = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Send chat message to 1980s AI
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await apiClient.post('/chat', request);
      return response.data;
    } catch (error: any) {
      console.error('Chat API error:', error);
      
      // Handle different error types
      if (error.response?.data) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.error || 'Failed to get response from Time Machine');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to Time Machine server. Is the backend running?');
      } else if (error.code === 'TIMEOUT') {
        throw new Error('Time Machine is taking too long to respond. Please try again.');
      } else {
        throw new Error('Something went wrong with the Time Machine. Please try again.');
      }
    }
  }

  // Get server info
  static async getServerInfo(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Failed to get server info:', error);
      return null;
    }
  }
}

export default TimeMachineAPI;