import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import winston from 'winston';
import './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pricing', pricingRoutes);

// Setup logger for error logging (optional, you can improve based on your needs)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

module.export = app;

// Database connection and server start (only for local development)
if (process.env.NODE_ENV !== 'production') { // Check if not in production
  const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');  // Use console.log for local debugging
      const PORT = process.env.SERVER_PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        console.log(`Server running on port ${PORT}`); // Also console log for local
      });
    } catch (error) {
      console.error("MongoDB connection error:", error); // Log connection errors
      logger.error("MongoDB connection error:", error);
    }
  };

  startServer();
}


