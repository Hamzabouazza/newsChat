#!/bin/bash

# Script to run both the FastAPI backend and React frontend

# Function to stop all background processes when script is terminated
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to call cleanup function when script is terminated
trap cleanup INT TERM

# Setup terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting News Chatbot Application...${NC}"

# Start FastAPI backend
echo -e "${BLUE}Starting FastAPI backend on http://localhost:8000...${NC}"
cd $(dirname "$0")
python3 -m uvicorn main:app --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo -e "${BLUE}Starting React frontend on http://localhost:3000...${NC}"
cd $(dirname "$0")/news-chatbot-react
npm start &
FRONTEND_PID=$!

echo -e "${GREEN}Both services are running! Access the chatbot at http://localhost:3000${NC}"
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 