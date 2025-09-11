# Architecture Design Prompts

## Prompt 1: Event-Driven Architecture
```
Design an event-driven microservices architecture for a product management system with:
- Core service (product CRUD)
- Analytics service (event processing)
- Notification service (real-time alerts)
- React frontend
- Kafka for event streaming
- PostgreSQL for products, DynamoDB for analytics
- MinIO for file storage

Include Mermaid diagrams for system overview and event flow sequence.
```

## Prompt 2: Event Contracts
```
Create event schemas for:
- ProductCreated
- ProductUpdated  
- ProductDeleted
- LowStockWarning

Include TypeScript interfaces and JSON schemas with proper validation.
```

## Prompt 3: Database Design
```
Design database schemas for:
- Products table (PostgreSQL) with proper indexing
- Analytics events table (DynamoDB) with partition keys
- S3 storage structure for historical events

Justify indexing strategy and query patterns.
```
