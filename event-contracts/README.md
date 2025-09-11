# Event Contracts

This folder contains the event schemas and contracts for the Product Management System.

## Event Types

- **ProductCreated** - Emitted when a new product is created
- **ProductUpdated** - Emitted when a product is updated
- **ProductDeleted** - Emitted when a product is deleted
- **LowStockWarning** - Emitted when product quantity falls below threshold

## Schema Formats

- **TypeScript Interfaces** - For type safety in services
- **JSON Schema** - For validation and documentation
- **OpenAPI Schemas** - For API documentation
- **Kafka Schema Registry** - For message serialization

## Usage

These contracts ensure consistency across all services and provide clear documentation of the event structure for developers and consumers.
