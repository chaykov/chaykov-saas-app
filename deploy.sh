#!/bin/bash

# Deployment script for Chaykov SaaS Application
# Usage: ./deploy.sh [environment]
# Environments: local, production

set -e

ENVIRONMENT=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set docker-compose file based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.dev.yml"
fi

echo "🚀 Deploying Chaykov SaaS Application"
echo "📋 Environment: $ENVIRONMENT"
echo "📄 Using: $COMPOSE_FILE"
echo ""

cd "$SCRIPT_DIR"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before deploying!"
    echo "   Especially update POSTGRES_PASSWORD and VITE_API_URL"
    exit 1
fi

# Validate required environment variables
echo "🔍 Validating environment configuration..."
source .env

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "changeme_in_production" ]; then
    echo "⚠️  WARNING: POSTGRES_PASSWORD is not set or using default value!"
    echo "   Please update it in .env file for security."
    if [ "$ENVIRONMENT" = "production" ]; then
        exit 1
    fi
fi

if [ "$ENVIRONMENT" = "production" ]; then
    if [[ "$VITE_API_URL" == *"localhost"* ]]; then
        echo "⚠️  WARNING: VITE_API_URL contains 'localhost' in production environment!"
        echo "   Please update it to your VPS IP or domain in .env file."
        exit 1
    fi
fi

# Pull latest changes (only in production from git)
if [ "$ENVIRONMENT" = "production" ] && [ -d .git ]; then
    echo "📥 Pulling latest changes from git..."
    git pull origin main || echo "⚠️  Could not pull from git (continuing anyway)"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down || true

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f $COMPOSE_FILE up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check service health
echo "🏥 Checking service health..."

# Wait for postgres
echo "  - PostgreSQL..."
for i in {1..30}; do
    if docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
        echo "    ✅ PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "    ❌ PostgreSQL failed to start"
        docker-compose -f $COMPOSE_FILE logs postgres
        exit 1
    fi
    sleep 2
done

# Wait for backend
echo "  - Backend API..."
for i in {1..30}; do
    if curl -f http://localhost:${BACKEND_HOST_PORT:-3001}/health > /dev/null 2>&1; then
        echo "    ✅ Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "    ❌ Backend failed to start"
        docker-compose -f $COMPOSE_FILE logs backend
        exit 1
    fi
    sleep 2
done

# Wait for frontend
echo "  - Frontend..."
for i in {1..30}; do
    if curl -f http://localhost:${FRONTEND_HOST_PORT:-80}/health > /dev/null 2>&1; then
        echo "    ✅ Frontend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "    ❌ Frontend failed to start"
        docker-compose -f $COMPOSE_FILE logs frontend
        exit 1
    fi
    sleep 2
done

# Display service status
echo ""
echo "📊 Service Status:"
docker-compose -f $COMPOSE_FILE ps

# Display access URLs
echo ""
echo "✨ Deployment successful!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend:  http://localhost:${FRONTEND_HOST_PORT:-80}"
echo "   Backend:   http://localhost:${BACKEND_HOST_PORT:-3001}"
echo "   API Health: http://localhost:${BACKEND_HOST_PORT:-3001}/health"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose -f $COMPOSE_FILE logs -f"
echo "   Stop services:    docker-compose -f $COMPOSE_FILE down"
echo "   Restart services: docker-compose -f $COMPOSE_FILE restart"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me || echo "YOUR_VPS_IP")
    echo "🌍 Public URLs (if deployed on VPS):"
    echo "   Frontend:  http://$SERVER_IP"
    echo "   Backend:   http://$SERVER_IP:${BACKEND_PORT:-3001}"
    echo ""
fi
