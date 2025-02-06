import PricingService from '../services/PricingService.js';
import { validationResult } from 'express-validator'; // For input validation
import winston from 'winston';

// Logger setup for tracking controller actions
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/pricing.log' }) // Logs pricing-related actions
  ],
});

class PricingController {
  /**
   * Handle cost calculation based on weight, distance, and cargo type.
   * Validates input and calculates the cost using the PricingService.
   * @param {Object} req - The request object containing weight, distance, and cargoType.
   * @param {Object} res - The response object.
   */
  async calculateCost(req, res) {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { weight, distance, cargoType } = req.body;
      const cost = await PricingService.calculateCost(weight, distance, cargoType);

      // Log successful cost calculation
      logger.info(`✅ Cost calculated for cargoType: ${cargoType}, Weight: ${weight}, Distance: ${distance}`);

      res.json({ cost });
    } catch (error) {
      // Log calculation failure
      logger.error(`❌ Error calculating cost: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Create a new pricing rule in the system.
   * Validates input and calls PricingService to save the pricing rule.
   * @param {Object} req - The request object containing pricing data.
   * @param {Object} res - The response object.
   */
  async createPricingRule(req, res) {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { cargoType, basePrice, weightMultiplier, distanceMultiplier } = req.body;
      const pricing = await PricingService.createPricingRule(cargoType, basePrice, weightMultiplier, distanceMultiplier);

      // Log pricing rule creation
      logger.info(`✅ Pricing rule created: ${cargoType}`);

      res.status(201).json(pricing); // Respond with the newly created pricing rule
    } catch (error) {
      // Log creation failure
      logger.error(`❌ Error creating pricing rule: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update an existing pricing rule based on cargo type.
   * @param {Object} req - The request object containing the new data.
   * @param {Object} res - The response object.
   */
  async updatePricingRule(req, res) {
    const { id } = req.params;

    try {
      const updatedPricing = await PricingService.updatePricing(id, req.body, req.user);

      // Log successful update
      logger.info(`✅ Pricing rule updated for ID: ${id}`);

      res.json(updatedPricing); // Respond with the updated pricing rule
    } catch (error) {
      // Log update failure
      logger.error(`❌ Error updating pricing rule for ID: ${id} - ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete a pricing rule based on its ID.
   * @param {Object} req - The request object containing the pricing rule ID.
   * @param {Object} res - The response object.
   */
  async deletePricingRule(req, res) {
    const { id } = req.params;

    try {
      await PricingService.deletePricing(id, req.user);

      // Log successful deletion
      logger.info(`🗑️ Pricing rule deleted for ID: ${id}`);

      res.json({ message: 'Pricing rule deleted' });
    } catch (error) {
      // Log deletion failure
      logger.error(`❌ Error deleting pricing rule for ID: ${id} - ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Retrieve all pricing rules with pagination.
   * @param {Object} req - The request object containing pagination info.
   * @param {Object} res - The response object.
   */
  async getAllPricingRules(req, res) {
    const { page, limit } = req.query;

    try {
      const pricingData = await PricingService.getAllPricingRules(page, limit);

      // Log successful retrieval
      logger.info(`✅ Fetched ${pricingData.data.length} pricing rules from page ${page}`);

      res.json(pricingData); // Respond with paginated pricing data
    } catch (error) {
      // Log fetching failure
      logger.error(`❌ Error fetching pricing rules: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new PricingController();
