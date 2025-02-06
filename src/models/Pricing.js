import mongoose from 'mongoose';
import winston from 'winston'; // Import logging library

// Create a logger to track pricing updates and deletions
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/admin-actions.log' }) // Log admin actions
  ],
});

// Define the Pricing schema
const pricingSchema = new mongoose.Schema(
  {
    cargoType: { 
      type: String, 
      enum: ['perishable', 'fragile', 'general'], 
      required: true 
    },
    basePrice: { 
      type: Number, 
      required: true, 
      min: [0, 'Base price must be a positive number'] // Ensure base price is valid
    },
    weightMultiplier: { 
      type: Number, 
      required: true, 
      min: [0, 'Weight multiplier must be a positive number'] 
    },
    distanceMultiplier: { 
      type: Number, 
      required: true, 
      min: [0, 'Distance multiplier must be a positive number'] 
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt timestamps
);

// Create indexes for faster queries
pricingSchema.index({ cargoType: 1 });
pricingSchema.index({ cargoType: 1, basePrice: 1 });

// Middleware: Log admin actions when pricing is updated or deleted
pricingSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(`Pricing rule updated for ${doc.cargoType}`);
  }
});

pricingSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(`Pricing rule deleted for ${doc.cargoType}`);
  }
});

export default mongoose.model('Pricing', pricingSchema);
