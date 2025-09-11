import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const createDynamoDBClient = (): DynamoDBClient => {
  const config = {
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.NODE_ENV === 'development' && {
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
      },
    }),
  };

  return new DynamoDBClient(config);
};

export const dynamoDBClient = createDynamoDBClient();
export const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'product-analytics';

