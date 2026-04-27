#!/bin/bash

###############################################################################
# MindRight Shutdown Script
# Stops all services gracefully
###############################################################################

set -e

echo "🛑 Stopping MindRight services..."

# Kill backend
if [ -f .pids/backend.pid ]; then
    PID=$(cat .pids/backend.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ Backend stopped"
    fi
    rm .pids/backend.pid
fi

# Kill web server
if [ -f .pids/web.pid ]; then
    PID=$(cat .pids/web.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ Web dev server stopped"
    fi
    rm .pids/web.pid
fi

# Stop Docker services
echo "Stopping Docker services..."
docker-compose down
echo "✅ Docker services stopped"

echo "✅ All services stopped"
