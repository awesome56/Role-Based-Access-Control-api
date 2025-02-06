import mongoose from 'mongoose';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config(); // Load environment variables

// Logger setup for tracking database events
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/database.log' }),
  ],
});

class Database {
  constructor() {
    this.maxRetries = 5; // Maximum reconnection attempts
    this.retryDelay = 5000; // Delay between retries (5 seconds)
    this.connect(); // Establish initial connection
  }

  async connect(retries = this.maxRetries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected successfully');
      logger.info('MongoDB connection established.');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      logger.error(`Database connection error: ${error.message}`);

      if (retries > 0) {
        console.log(`🔄 Retrying connection in ${this.retryDelay / 1000} seconds...`);
        setTimeout(() => this.connect(retries - 1), this.retryDelay);
      } else {
        console.log('🚨 Max retries reached. Could not connect to the database.');
        logger.error('Max retries reached. Database connection failed.');
      }
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('⚡ MongoDB disconnected');
      logger.info('MongoDB connection closed.');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
      logger.error(`Database disconnection error: ${error.message}`);
    }
  }
}

export default new Database();