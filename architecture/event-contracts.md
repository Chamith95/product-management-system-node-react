# Event Contracts & Schemas

## Event Metadata Structure

All events share common metadata fields:

```json
{
  "eventId": "string (UUID)",
  "eventType": "string (enum)",
  "version": "string (semver)",
  "timestamp": "string (ISO 8601)",
  "correlationId": "string (UUID)",
  "source": "string (service name)",
  "userId": "string (UUID)",
  "sessionId": "string (UUID)",
  "metadata": {
    "userAgent": "string",
    "ipAddress": "string",
    "requestId": "string"
  }
}
```

## Event Schemas

### 1. ProductCreated Event

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["eventId", "eventType", "version", "timestamp", "correlationId", "source", "userId", "data"],
  "properties": {
    "eventId": {
      "type": "string",
      "format": "uuid",
      "description": "Unique event identifier"
    },
    "eventType": {
      "type": "string",
      "enum": ["ProductCreated"],
      "description": "Event type"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Event schema version"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Event creation timestamp"
    },
    "correlationId": {
      "type": "string",
      "format": "uuid",
      "description": "Correlation ID for tracing"
    },
    "source": {
      "type": "string",
      "description": "Source service name"
    },
    "userId": {
      "type": "string",
      "format": "uuid",
      "description": "User who created the product"
    },
    "sessionId": {
      "type": "string",
      "format": "uuid",
      "description": "User session ID"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userAgent": {"type": "string"},
        "ipAddress": {"type": "string"},
        "requestId": {"type": "string"}
      }
    },
    "data": {
      "type": "object",
      "required": ["productId", "name", "description", "price", "quantity", "category", "sellerId"],
      "properties": {
        "productId": {
          "type": "string",
          "format": "uuid",
          "description": "Product identifier"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 255
        },
        "description": {
          "type": "string",
          "maxLength": 1000
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "description": "Price in cents"
        },
        "quantity": {
          "type": "integer",
          "minimum": 0
        },
        "category": {
          "type": "string",
          "enum": ["electronics", "clothing", "books", "home", "sports", "other"]
        },
        "sellerId": {
          "type": "string",
          "format": "uuid"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
}
```

### 2. ProductUpdated Event

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["eventId", "eventType", "version", "timestamp", "correlationId", "source", "userId", "data"],
  "properties": {
    "eventId": {
      "type": "string",
      "format": "uuid"
    },
    "eventType": {
      "type": "string",
      "enum": ["ProductUpdated"]
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "correlationId": {
      "type": "string",
      "format": "uuid"
    },
    "source": {
      "type": "string"
    },
    "userId": {
      "type": "string",
      "format": "uuid"
    },
    "sessionId": {
      "type": "string",
      "format": "uuid"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userAgent": {"type": "string"},
        "ipAddress": {"type": "string"},
        "requestId": {"type": "string"}
      }
    },
    "data": {
      "type": "object",
      "required": ["productId", "changes", "previousState"],
      "properties": {
        "productId": {
          "type": "string",
          "format": "uuid"
        },
        "changes": {
          "type": "object",
          "description": "Fields that were updated",
          "properties": {
            "name": {"type": "string"},
            "description": {"type": "string"},
            "price": {"type": "number"},
            "quantity": {"type": "integer"},
            "category": {"type": "string"}
          }
        },
        "previousState": {
          "type": "object",
          "description": "Previous product state"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
}
```

### 3. ProductDeleted Event

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["eventId", "eventType", "version", "timestamp", "correlationId", "source", "userId", "data"],
  "properties": {
    "eventId": {
      "type": "string",
      "format": "uuid"
    },
    "eventType": {
      "type": "string",
      "enum": ["ProductDeleted"]
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "correlationId": {
      "type": "string",
      "format": "uuid"
    },
    "source": {
      "type": "string"
    },
    "userId": {
      "type": "string",
      "format": "uuid"
    },
    "sessionId": {
      "type": "string",
      "format": "uuid"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userAgent": {"type": "string"},
        "ipAddress": {"type": "string"},
        "requestId": {"type": "string"}
      }
    },
    "data": {
      "type": "object",
      "required": ["productId", "deletedAt"],
      "properties": {
        "productId": {
          "type": "string",
          "format": "uuid"
        },
        "deletedAt": {
          "type": "string",
          "format": "date-time"
        },
        "reason": {
          "type": "string",
          "description": "Optional reason for deletion"
        }
      }
    }
  }
}
```

### 4. LowStockWarning Event

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["eventId", "eventType", "version", "timestamp", "correlationId", "source", "userId", "data"],
  "properties": {
    "eventId": {
      "type": "string",
      "format": "uuid"
    },
    "eventType": {
      "type": "string",
      "enum": ["LowStockWarning"]
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "correlationId": {
      "type": "string",
      "format": "uuid"
    },
    "source": {
      "type": "string"
    },
    "userId": {
      "type": "string",
      "format": "uuid"
    },
    "sessionId": {
      "type": "string",
      "format": "uuid"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userAgent": {"type": "string"},
        "ipAddress": {"type": "string"},
        "requestId": {"type": "string"}
      }
    },
    "data": {
      "type": "object",
      "required": ["productId", "currentQuantity", "threshold", "productName"],
      "properties": {
        "productId": {
          "type": "string",
          "format": "uuid"
        },
        "productName": {
          "type": "string"
        },
        "currentQuantity": {
          "type": "integer",
          "minimum": 0
        },
        "threshold": {
          "type": "integer",
          "minimum": 0,
          "description": "Stock threshold that triggered warning"
        },
        "sellerId": {
          "type": "string",
          "format": "uuid"
        },
        "category": {
          "type": "string"
        },
        "severity": {
          "type": "string",
          "enum": ["low", "medium", "high", "critical"],
          "description": "Warning severity level"
        }
      }
    }
  }
}
```

## Event Routing Configuration

### AWS SNS/SQS Setup

```yaml
# Event Topics
Topics:
  ProductEvents:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: product-events
      DisplayName: Product Management Events

# Event Queues
Queues:
  NotificationsQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: notifications-queue
      VisibilityTimeoutSeconds: 30
      MessageRetentionPeriod: 1209600  # 14 days
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt NotificationsDLQ.Arn
        maxReceiveCount: 3

  AnalyticsQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: analytics-queue
      VisibilityTimeoutSeconds: 60
      MessageRetentionPeriod: 1209600
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt AnalyticsDLQ.Arn
        maxReceiveCount: 5

# Dead Letter Queues
  NotificationsDLQ:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: notifications-dlq

  AnalyticsDLQ:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: analytics-dlq

# Event Subscriptions
Subscriptions:
  NotificationsSubscription:
    Type: AWS::SNS::Subscription
    Properties:
      TopicArn: !Ref ProductEvents
      Protocol: sqs
      Endpoint: !GetAtt NotificationsQueue.Arn
      FilterPolicy:
        eventType: ["ProductCreated", "ProductUpdated", "LowStockWarning"]

  AnalyticsSubscription:
    Type: AWS::SNS::Subscription
    Properties:
      TopicArn: !Ref ProductEvents
      Protocol: sqs
      Endpoint: !GetAtt AnalyticsQueue.Arn
      FilterPolicy:
        eventType: ["ProductCreated", "ProductUpdated", "ProductDeleted"]
```

## Event Processing Patterns

### 1. Event Sourcing
- Store all events in DynamoDB for audit trail
- Use events to rebuild application state
- Enable event replay for debugging

### 2. CQRS (Command Query Responsibility Segregation)
- Separate read and write models
- Optimize read model for queries
- Use events to update read models

### 3. Event Replay
- Rebuild state from historical events
- Support multiple read model versions
- Enable temporal queries

### 4. Event Filtering
- Route events based on type and content
- Support multiple consumers per event
- Enable selective event processing

## Error Handling & Retry Logic

### Retry Strategy
```javascript
const retryConfig = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelay: 1000, // 1 second
  maxDelay: 30000,     // 30 seconds
  jitter: true
};

// Exponential backoff with jitter
const calculateDelay = (attempt) => {
  const delay = Math.min(
    retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
    retryConfig.maxDelay
  );
  
  if (retryConfig.jitter) {
    return delay * (0.5 + Math.random() * 0.5);
  }
  
  return delay;
};
```

### Dead Letter Queue Processing
```javascript
const processDLQ = async (dlqUrl) => {
  const messages = await sqs.receiveMessage({
    QueueUrl: dlqUrl,
    MaxNumberOfMessages: 10
  }).promise();

  for (const message of messages.Messages) {
    try {
      // Analyze failed message
      const event = JSON.parse(message.Body);
      console.log('Failed event:', event);
      
      // Manual processing or alerting
      await alertFailedEvent(event, message);
      
      // Remove from DLQ after processing
      await sqs.deleteMessage({
        QueueUrl: dlqUrl,
        ReceiptHandle: message.ReceiptHandle
      }).promise();
    } catch (error) {
      console.error('Error processing DLQ message:', error);
    }
  }
};
```

## Event Versioning Strategy

### Versioning Rules
1. **Major Version**: Breaking changes to event schema
2. **Minor Version**: New optional fields added
3. **Patch Version**: Bug fixes and documentation updates

### Migration Strategy
```javascript
const eventMigrator = {
  migrateEvent: (event, targetVersion) => {
    const currentVersion = event.version;
    
    if (currentVersion === targetVersion) {
      return event;
    }
    
    // Apply migration steps
    const migrationSteps = getMigrationSteps(currentVersion, targetVersion);
    
    return migrationSteps.reduce((migratedEvent, step) => {
      return step(migratedEvent);
    }, event);
  },
  
  // Example migration step
  '1.0.0_to_1.1.0': (event) => {
    // Add new optional field
    if (!event.data.hasOwnProperty('metadata')) {
      event.data.metadata = {};
    }
    event.version = '1.1.0';
    return event;
  }
};
```
