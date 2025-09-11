#!/bin/bash

# Simple Start Script for Product Management System
# Uses .nvmrc to set correct Node.js version and starts services in dev mode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if .nvmrc exists
if [ ! -f .nvmrc ]; then
    print_error ".nvmrc file not found!"
    exit 1
fi

# Read Node.js version from .nvmrc
NODE_VERSION=$(cat .nvmrc)
print_status "Using Node.js version: $NODE_VERSION"

# Check if nvm is available
if command -v nvm >/dev/null 2>&1; then
    print_status "Using nvm to set Node.js version..."
    nvm use
elif [ -d "$HOME/.nvm" ]; then
    print_status "Loading nvm..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm use
else
    print_warning "nvm not found. Using system Node.js..."
    # Check if Homebrew Node.js is available
    if [ -d "/opt/homebrew/bin" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
        print_status "Added Homebrew Node.js to PATH"
    fi
fi

# Verify Node.js version
CURRENT_NODE_VERSION=$(node --version)
print_success "Current Node.js version: $CURRENT_NODE_VERSION"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_success "Created .env file from env.example"
    else
        print_error "env.example file not found!"
        exit 1
    fi
fi

# Kill any existing services on required ports
print_status "Checking for existing services on required ports..."

# Kill any existing Node.js processes running our services
print_status "Killing existing Node.js service processes..."
pkill -f "ts-node-dev.*core-service" 2>/dev/null || true
pkill -f "ts-node-dev.*analytics-service" 2>/dev/null || true
pkill -f "ts-node-dev.*notification-service" 2>/dev/null || true
pkill -f "vite.*product-dashboard" 2>/dev/null || true
pkill -f "node.*core-service" 2>/dev/null || true
pkill -f "node.*analytics-service" 2>/dev/null || true
pkill -f "node.*notification-service" 2>/dev/null || true
sleep 3

# Kill any processes on required ports
ports=(3000 3001 3002 3003)
for port in "${ports[@]}"; do
    if lsof -ti:$port >/dev/null 2>&1; then
        print_warning "Port $port is still in use. Force killing processes..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
done

# Double-check ports are free
for port in "${ports[@]}"; do
    if lsof -ti:$port >/dev/null 2>&1; then
        print_error "Port $port is still in use after cleanup!"
        lsof -i:$port
        exit 1
    fi
done

print_success "Ports cleared for new services"

# Check if node_modules exist for each service
print_status "Checking dependencies..."

services=("backend/core-service" "backend/analytics-service" "backend/notification-service" "frontend/product-dashboard")

for service in "${services[@]}"; do
    if [ ! -d "$service/node_modules" ]; then
        print_warning "Installing dependencies for $service..."
        cd "$service"
        npm install
        cd - > /dev/null
    fi
done

print_success "All dependencies are installed"

# Start infrastructure services
print_status "Starting infrastructure services (Docker)..."
docker-compose up -d postgres zookeeper kafka kafka-ui dynamodb minio

# Wait for infrastructure to be ready
print_status "Waiting for infrastructure services to be ready..."
sleep 10

# Setup analytics service database
print_status "Setting up analytics service database..."
cd backend/analytics-service
npm run setup-db
cd - > /dev/null

# Start services in development mode
print_status "Starting microservices in development mode..."

# Start services in background
print_status "Starting Core Service (Port 3000)..."
cd backend/core-service
npm run dev &
CORE_PID=$!
cd - > /dev/null

print_status "Starting Analytics Service (Port 3003)..."
cd backend/analytics-service
npm run dev &
ANALYTICS_PID=$!
cd - > /dev/null

print_status "Starting Notification Service (Port 3001)..."
cd backend/notification-service
npm run dev &
NOTIFICATION_PID=$!
cd - > /dev/null

print_status "Starting Frontend Dashboard (Port 3002)..."
cd frontend/product-dashboard
npm run dev -- --port 3002 &
FRONTEND_PID=$!
cd - > /dev/null

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 20

# Check service health
print_status "Checking service health..."

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is running"
            return 0
        fi
        print_status "Waiting for $service_name... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    print_warning "$service_name failed to start within expected time"
    return 1
}

# Check each service
check_service "Core Service" "http://localhost:3000/health"
check_service "Notification Service" "http://localhost:3001/health"
check_service "Analytics Service" "http://localhost:3003/api/health"
check_service "Frontend Dashboard" "http://localhost:3002"

# Display service URLs
echo ""
print_success "🚀 All services started successfully!"
echo ""
echo "📋 Service URLs:"
echo "  • Core Service API:      http://localhost:3000"
echo "  • Notification Service: http://localhost:3001"
echo "  • Analytics Service:     http://localhost:3003"
echo "  • Frontend Dashboard:    http://localhost:3002"
echo "  • Kafka UI:             http://localhost:8081"
echo "  • DynamoDB Local:        http://localhost:8000"
echo "  • MinIO Console:        http://localhost:9001"
echo ""

# Keep script running and handle cleanup
print_status "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    print_status "Stopping services..."
    
    # Kill service processes
    kill $CORE_PID $ANALYTICS_PID $NOTIFICATION_PID $FRONTEND_PID 2>/dev/null || true
    
    # Kill any remaining Node.js processes
    pkill -f "ts-node-dev.*core-service" 2>/dev/null || true
    pkill -f "ts-node-dev.*analytics-service" 2>/dev/null || true
    pkill -f "ts-node-dev.*notification-service" 2>/dev/null || true
    pkill -f "vite.*product-dashboard" 2>/dev/null || true
    
    # Kill any processes on our ports
    ports=(3000 3001 3002 3003)
    for port in "${ports[@]}"; do
        if lsof -ti:$port >/dev/null 2>&1; then
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    
    print_status "Stopping infrastructure services..."
    docker-compose down
    print_success "All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user interrupt
wait
