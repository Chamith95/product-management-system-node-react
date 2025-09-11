# Product Management System

Event-driven microservices system for product management with real-time notifications and analytics.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+

### Start Everything
```bash
# 1. Setup environment file
cp env.example .env

# 2. Start all services
./start-simple.sh
```

This will:
- ✅ Setup environment and dependencies
- ✅ Start all infrastructure (PostgreSQL, Kafka, DynamoDB, MinIO)
- ✅ Start all microservices
- ✅ Display service URLs

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3002 | React dashboard |
| **Core API** | http://localhost:3000 | Product management |
| **Notifications** | http://localhost:3001 | Real-time updates |
| **Analytics** | http://localhost:3003 | Event processing |

## 🏗️ Architecture

```
Frontend → Core Service → Kafka → Analytics/Notification Services
                ↓
            PostgreSQL
```

**Services:**
- **Core Service** (3000) - Product CRUD API
- **Analytics Service** (3003) - Event processing
- **Notification Service** (3001) - WebSocket notifications
- **Frontend** (3002) - React dashboard

**Infrastructure:**
- PostgreSQL (5433) - Product database
- Kafka (9092) - Message broker
- DynamoDB (8000) - Analytics data
- MinIO (9000) - File storage

## 📋 Commands

```bash
# Development
./start-dev.sh          # Start everything
./kill-services.sh       # Stop all services
docker-compose up        # Docker only

# Individual services
npm run dev:core         # Core service only
npm run dev:analytics    # Analytics service only
npm run dev:frontend     # Frontend only

# Health checks
curl http://localhost:3000/api/health  # Core
curl http://localhost:3001/api/health  # Notifications
curl http://localhost:3003/api/health  # Analytics
```

## 🔧 Environment

Copy environment template:
```bash
cp env.example .env
```

Key variables:
- `CORE_SERVICE_PORT=3000`
- `NOTIFICATION_SERVICE_PORT=3001`
- `FRONTEND_PORT=3002`
- `ANALYTICS_SERVICE_PORT=3003`

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Event Bus**: Kafka
- **Databases**: PostgreSQL + DynamoDB
- **Storage**: MinIO (S3-compatible)
- **Real-time**: WebSocket
- **Orchestration**: Docker Compose

## 📊 Monitoring

- **Kafka UI**: http://localhost:8081
- **DynamoDB**: http://localhost:8000
- **MinIO**: http://localhost:9001

## 🚨 Troubleshooting

**Services not starting?**
- Check Docker: `docker ps`
- Check logs: `docker-compose logs [service-name]`
- Verify ports aren't in use

**Port conflicts?**
- Core: 3000, Notifications: 3001, Frontend: 3002, Analytics: 3003