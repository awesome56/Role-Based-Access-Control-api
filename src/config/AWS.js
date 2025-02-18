import AWS from 'aws-sdk';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Logger setup for tracking AWS configuration events
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/aws.log' }) // Log AWS events
  ],
});

class AWSConfig {
  constructor() {
    // Validate required environment variables
    if (!process.env.AWS_DEFAULT_REGION || !process.env.AWS_ACCESS || !process.env.AWS_SECRET) {
      logger.error('❌ Missing AWS configuration variables. Please check your .env file.');
      throw new Error('AWS configuration variables are missing.');
    }

    // Update AWS configuration
    AWS.config.update({
      region: process.env.AWS_DEFAULT_REGION,
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
    });

    // Initialize AWS services (e.g., S3)
    this.s3 = new AWS.S3();
    
    console.log('✅ AWS SDK initialized successfully');
    logger.info('AWS SDK initialized successfully.');
  }

  /**
   * Get an instance of an AWS service.
   * Example usage: `AWSConfig.getService('S3')`
   */
  getService(serviceName) {
    try {
      return new AWS[serviceName]();
    } catch (error) {
      logger.error(`AWS Service Error: ${error.message}`);
      throw new Error(`Failed to initialize AWS service: ${serviceName}`);
    }
  }
}

export default new AWSConfig(); // Singleton instance
