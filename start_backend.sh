#!/bin/bash

echo "🚀 Starting Emotion Detection Backend Server..."
echo ""

cd "$(dirname "$0")"

# Check if dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "⚠️  Flask not found. Installing dependencies..."
    pip3 install -r backend_requirements.txt
fi

echo "✅ Starting Flask server on http://localhost:5000"
echo "📡 Press CTRL+C to stop"
echo ""

python3 app.py
