import { S3Client } from '@aws-sdk/client-s3';

const createS3Client = (): S3Client => {
  const config = {
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.NODE_ENV === 'development' && {
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO
    }),
  };

  return new S3Client(config);
};

export const s3Client = createS3Client();
export const HISTORICAL_BUCKET = process.env.S3_HISTORICAL_BUCKET || 'analytics-historical';
export const ARCHIVE_BUCKET = process.env.S3_ARCHIVE_BUCKET || 'analytics-archive';
