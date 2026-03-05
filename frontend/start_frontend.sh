#!/bin/bash

echo "🚀 Starting Emotion Detection Frontend..."
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed. Running npm install..."
    npm install
fi

echo "✅ Starting React development server"
echo "📡 Browser will open at http://localhost:3000"
echo "📡 Press CTRL+C to stop"
echo ""

npm start
