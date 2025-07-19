#!/bin/bash

# Test script for Time Machine API
# This script tests various endpoints using curl

echo "Time Machine API Test Script"
echo "============================"

# Base URL
BASE_URL="http://localhost:8000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n1. Testing Health Check Endpoint..."
response=$(curl -s -X GET "$BASE_URL/health")
echo "Response: $response"

# Test 2: Root Endpoint
echo -e "\n2. Testing Root Endpoint..."
response=$(curl -s -X GET "$BASE_URL/")
echo "Response: $response"

# Test 3: Chat Endpoint - Simple Query
echo -e "\n3. Testing Chat Endpoint - Simple Query..."
response=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the internet?"
  }')
echo "Response: $response"

# Test 4: Chat Endpoint - With Session ID
echo -e "\n4. Testing Chat Endpoint - With Session ID..."
response=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Tell me about smartphones",
    "session_id": "test-session-123"
  }')
echo "Response: $response"

# Test 5: Chat Endpoint - 1980s Context Query
echo -e "\n5. Testing Chat Endpoint - 1980s Context Query..."
response=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What was popular slang in your time?",
    "session_id": "test-session-123"
  }')
echo "Response: $response"

# Test 6: Chat Endpoint - Modern Tech Query
echo -e "\n6. Testing Chat Endpoint - Modern Tech Query..."
response=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Can you explain what TikTok is?"
  }')
echo "Response: $response"

# Test 7: Invalid Request
echo -e "\n7. Testing Invalid Request..."
response=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "invalid_field": "test"
  }')
echo "Response: $response"

echo -e "\n${GREEN}All tests completed!${NC}"
echo "Make sure to check the responses for 1980s character authenticity!"