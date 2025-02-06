import Pricing from '../models/Pricing.js';
import winston from 'winston';

// Logger setup for tracking pricing changes
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/pricing.log' }) // Logs pricing-related actions
  ],
});

class PricingService {
  /**
   * Create a new pricing rule for a specific cargo type.
   * @param {string} cargoType - The type of cargo (e.g., perishable, fragile, general).
   * @param {number} basePrice - The base price for the cargo type.
   * @param {number} weightMultiplier - Cost per unit weight.
   * @param {number} distanceMultiplier - Cost per unit distance.
   */
  async createPricingRule(cargoType, basePrice, weightMultiplier, distanceMultiplier) {
    try {
      // Check if a pricing rule for the cargo type already exists
      const existingRule = await Pricing.findOne({ cargoType });

      if (existingRule) {
        throw new Error(`Pricing rule for '${cargoType}' already exists.`);
      }

      // Create a new pricing rule
      const newPricing = new Pricing({
        cargoType,
        basePrice,
        weightMultiplier,
        distanceMultiplier
      });

      await newPricing.save();

      return newPricing;
    } catch (error) {
      logger.error(`❌ Error creating pricing rule: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate the shipping cost based on weight, distance, and cargo type.
   * @param {number} weight - The weight of the cargo.
   * @param {number} distance - The distance to be covered.
   * @param {string} cargoType - The type of cargo (perishable, fragile, general).
   */
  async calculateCost(weight, distance, cargoType) {
    try {
      // Find pricing rule for the given cargo type
      const pricing = await Pricing.findOne({ cargoType });

      if (!pricing) {
        throw new Error(`Pricing rules for '${cargoType}' not found`);
      }

      // Compute total cost using predefined multipliers
      const totalCost = (
        pricing.basePrice +
        weight * pricing.weightMultiplier +
        distance * pricing.distanceMultiplier
      );

      return totalCost;
    } catch (error) {
      logger.error(`❌ Error calculating cost: ${error.message}`);
      throw error; // The controller will catch this
    }
  }

  /**
   * Retrieve all pricing rules with pagination.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of records per page.
   */
  async getAllPricingRules(page = 1, limit = 10) {
    try {
      const pricingRules = await Pricing.find()
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Pricing.countDocuments();
      return {
        data: pricingRules,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      };
    } catch (error) {
      logger.error(`❌ Error fetching pricing rules: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update pricing rules for a specific cargo type.
   * @param {string} cargoType - The type of cargo to update.
   * @param {Object} newData - The new pricing data.
   */
  async updatePricing(cargoType, newData) {
    try {
      const updatedPricing = await Pricing.findOneAndUpdate(
        { cargoType },
        newData,
        { new: true, upsert: true }
      );

      if (!updatedPricing) {
        throw new Error(`Failed to update pricing for ${cargoType}`);
      }

      return updatedPricing;
    } catch (error) {
      logger.error(`❌ Error updating pricing: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a pricing rule based on its ID.
   * @param {string} pricingId - The ID of the pricing rule to delete.
   */
  async deletePricing(pricingId) {
    try {
      const deletedPricing = await Pricing.findByIdAndDelete(pricingId);

      if (!deletedPricing) {
        throw new Error(`Pricing rule with ID ${pricingId} not found`);
      }

      return deletedPricing;
    } catch (error) {
      logger.error(`❌ Error deleting pricing rule: ${error.message}`);
      throw error;
    }
  }
}

export default new PricingService();
