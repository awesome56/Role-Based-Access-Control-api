import express from 'express';
import PricingController from '../controllers/PricingController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Apply middleware to protect routes
router.use(AuthMiddleware.authenticate);

// Admin-only routes
router.post(
  '/',
  AuthMiddleware.checkRole(['admin']),
  PricingController.createPricingRule
);
router.put(
  '/:id',
  AuthMiddleware.checkRole(['admin']),
  PricingController.updatePricingRule
);
router.delete(
  '/:id',
  AuthMiddleware.checkRole(['admin']),
  PricingController.deletePricingRule
);

// Shipper and Admin routes
router.post(
  '/calculate',
  AuthMiddleware.checkRole(['admin', 'shipper']),
  PricingController.calculateCost
);

// Carrier, Shipper and Admin routes
router.get(
  '/',
  AuthMiddleware.checkRole(['admin', 'shipper', 'carrier']),
  PricingController.getAllPricingRules
);

export default router;