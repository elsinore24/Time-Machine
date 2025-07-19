#!/bin/bash

echo "🧪 Testing Time Machine Integration"
echo "=================================="

# Test backend health
echo "1. Testing Backend Health..."
BACKEND_HEALTH=$(curl -s http://localhost:8000/health)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running: $BACKEND_HEALTH"
else
    echo "❌ Backend is not accessible"
    echo "🔧 Make sure to start the backend with: cd backend && python app.py"
fi

# Test frontend availability
echo ""
echo "2. Testing Frontend Availability..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not accessible"
    echo "🔧 Make sure to start the frontend with: cd frontend && npm start"
fi

# Test backend chat endpoint
echo ""
echo "3. Testing Backend Chat API..."
CHAT_RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is totally tubular?"}')

if [ $? -eq 0 ] && [[ "$CHAT_RESPONSE" == *"response"* ]]; then
    echo "✅ Chat API is working!"
    echo "📝 Sample response: $(echo $CHAT_RESPONSE | cut -c1-100)..."
else
    echo "❌ Chat API failed"
    echo "🔧 Check backend logs for errors"
fi

echo ""
echo "🎉 Integration test complete!"
echo "📱 Open http://localhost:3000 in your browser to use the Time Machine"