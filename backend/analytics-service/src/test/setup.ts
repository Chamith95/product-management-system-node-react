import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.DYNAMODB_TABLE_NAME = 'test-product-analytics';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

