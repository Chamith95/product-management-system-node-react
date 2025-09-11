const { S3Client, CreateBucketCommand, PutBucketLifecycleConfigurationCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

const HISTORICAL_BUCKET = process.env.S3_HISTORICAL_BUCKET || 'analytics-historical';
const ARCHIVE_BUCKET = process.env.S3_ARCHIVE_BUCKET || 'analytics-archive';

async function createBucket(bucketName) {
  try {
    await client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} created successfully`);
  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`Bucket ${bucketName} already exists`);
    } else {
      throw error;
    }
  }
}

async function setupLifecycleRules(bucketName) {
  const lifecycleConfig = {
    Rules: [
      {
        ID: 'TransitionToArchive',
        Status: 'Enabled',
        Filter: { Prefix: 'events/' },
        Transitions: [
          {
            Days: 30,
            StorageClass: 'GLACIER',
          },
        ],
      },
      {
        ID: 'DeleteOldData',
        Status: 'Enabled',
        Filter: { Prefix: 'events/' },
        Expiration: {
          Days: 2555, // 7 years
        },
      },
    ],
  };

  try {
    await client.send(new PutBucketLifecycleConfigurationCommand({
      Bucket: bucketName,
      LifecycleConfiguration: lifecycleConfig,
    }));
    console.log(`Lifecycle rules configured for ${bucketName}`);
  } catch (error) {
    console.error(`Failed to configure lifecycle rules for ${bucketName}:`, error.message);
  }
}

async function setupS3() {
  try {
    console.log('Setting up S3 buckets...');
    
    // Create buckets
    await createBucket(HISTORICAL_BUCKET);
    await createBucket(ARCHIVE_BUCKET);
    
    // Setup lifecycle rules for historical bucket
    await setupLifecycleRules(HISTORICAL_BUCKET);
    
    console.log('S3 setup completed successfully');
  } catch (error) {
    console.error('S3 setup failed:', error);
    process.exit(1);
  }
}

setupS3();
