#!/bin/bash

###############################################################################
# MindRight Complete Stack Setup Script
# 
# This script sets up the entire MindRight application locally:
# - Starts Docker services (PostgreSQL, Redis)
# - Builds and runs the backend (Spring Boot)
# - Builds the web dashboard (React)
# - Loads the Chrome extension
#
# Usage: ./scripts/setup.sh
###############################################################################

set -e

echo "🧠 MindRight — Complete Stack Setup"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop."
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 21+."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+."
    exit 1
fi

echo "✅ All prerequisites found."
echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d
echo "⏳ Waiting for services to be ready..."
sleep 10
echo "✅ Docker services running (PostgreSQL, Redis)"
echo ""

# Build and run backend
echo "🔧 Building backend..."
cd apps/backend
./mvnw clean package -DskipTests -q
echo "✅ Backend built successfully"
echo ""

# Run backend in background
echo "▶️  Starting backend server..."
./mvnw spring-boot:run > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend running (PID: $BACKEND_PID)"
sleep 5
echo ""

# Build web dashboard
echo "🎨 Setting up web dashboard..."
cd ../web
npm install
npm run build
echo "✅ Web dashboard built"
echo ""

# Start web dev server
echo "▶️  Starting web dev server..."
npm run dev > ../../logs/web.log 2>&1 &
WEB_PID=$!
echo "✅ Web dev server running (PID: $WEB_PID)"
sleep 3
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "📍 Service URLs:"
echo "   Backend API:      http://localhost:8080"
echo "   Web Dashboard:    http://localhost:5173"
echo "   Database:         localhost:5432"
echo "   Cache:            localhost:6379"
echo ""
echo "📱 Next Steps:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Register a new account or login"
echo "   3. Load the Chrome extension:"
echo "      - Open chrome://extensions/"
echo "      - Enable 'Developer Mode'"
echo "      - Click 'Load unpacked'"
echo "      - Select the 'apps/extension' folder"
echo ""
echo "📖 Logs:"
echo "   Backend: logs/backend.log"
echo "   Web:     logs/web.log"
echo ""
echo "🛑 To stop all services:"
echo "   scripts/stop.sh"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID" > .pids/backend.pid
echo "$WEB_PID" > .pids/web.pid
