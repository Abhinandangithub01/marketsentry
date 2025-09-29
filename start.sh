#!/bin/bash

echo "🚀 Starting MarketSentry deployment..."

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "📦 Build directory not found, running build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "✅ Build directory found"
fi

# Check if build/index.html exists
if [ ! -f "build/index.html" ]; then
    echo "📦 index.html not found, running build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo "🌐 Starting server..."
node server.js
