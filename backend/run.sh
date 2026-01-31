#!/bin/bash

echo "Starting Cotton Leaf Disease Prediction Backend..."
echo ""

if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

echo "Checking Ollama connection..."
if ! curl -s http://localhost:11434/api/version > /dev/null; then
    echo "Warning: Ollama is not running!"
    echo "Please start Ollama with: ollama serve"
    echo ""
fi

echo "Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
