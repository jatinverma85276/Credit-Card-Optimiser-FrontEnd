#!/bin/bash

# Setup script for SwipeSmart frontend

echo "🚀 Setting up SwipeSmart Frontend..."

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please update BACKEND_URL in .env.local if your backend is not running on http://localhost:8000"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Make sure your backend is running on the URL specified in .env.local"
