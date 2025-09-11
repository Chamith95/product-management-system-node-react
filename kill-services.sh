#!/bin/bash

# Kill Services Script
# Kills all running services and clears ports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Killing all product management services..."

# Kill Node.js service processes
print_status "Killing Node.js service processes..."
pkill -f "ts-node-dev.*core-service" 2>/dev/null && print_success "Core service killed" || print_warning "Core service not running"
pkill -f "ts-node-dev.*analytics-service" 2>/dev/null && print_success "Analytics service killed" || print_warning "Analytics service not running"
pkill -f "ts-node-dev.*notification-service" 2>/dev/null && print_success "Notification service killed" || print_warning "Notification service not running"
pkill -f "vite.*product-dashboard" 2>/dev/null && print_success "Frontend killed" || print_warning "Frontend not running"

# Kill any processes on our ports
print_status "Clearing ports 3000-3003..."
ports=(3000 3001 3002 3003)
for port in "${ports[@]}"; do
    if lsof -ti:$port >/dev/null 2>&1; then
        print_warning "Killing processes on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        print_success "Port $port cleared"
    else
        print_success "Port $port is free"
    fi
done

# Stop Docker containers
print_status "Stopping Docker containers..."
docker-compose down 2>/dev/null && print_success "Docker containers stopped" || print_warning "No Docker containers running"

print_success "All services killed and ports cleared!"
echo ""
echo "You can now run: ./start-simple.sh"
