# Microservices Implementation Prompts

## Prompt 1: Core Service Scaffold
```
Generate a Node.js Express service scaffold for product CRUD operations with:
- TypeScript + Express
- TypeORM with PostgreSQL
- Kafka event emission
- Health check endpoint
- Error handling middleware
- Request logging
- Docker configuration

Include proper folder structure and package.json.
```

## Prompt 2: Analytics Service
```
Create an analytics service that:
- Consumes Kafka events
- Processes ProductCreated/Updated/Deleted events
- Stores analytics data in DynamoDB
- Archives historical events to S3
- Uses AWS SDK for DynamoDB and S3
- Implements TTL for data retention

Include event processing logic and data models.
```

## Prompt 3: Notification Service
```
Build a notification service with:
- Kafka event consumption
- WebSocket server for real-time updates
- LowStockWarning event handling
- Seller-specific notifications
- Health check endpoint
- Docker configuration

Include Socket.io setup and event routing.
```
