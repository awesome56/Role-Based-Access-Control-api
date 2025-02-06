import AuthService from '../services/AuthService.js';
import { validationResult } from 'express-validator'; // For validation checks
import winston from 'winston';

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/auth.log' }) // Logs authentication-related actions
  ],
});

class AuthController {
  /**
   * Handle user registration.
   * Validates input and creates a new user in the system.
   * @param {Object} req - The request object containing user data.
   * @param {Object} res - The response object.
   */
  async register(req, res) {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Register user via AuthService
      const user = await AuthService.register(req.body.email, req.body.password, req.body.role);

      // Log successful registration
      logger.info(`✅ User registered: ${req.body.email}`);

      res.status(201).json(user); // Respond with the newly created user
    } catch (error) {
      // Log error
      logger.error(`❌ Registration failed: ${error.message}`);

      res.status(400).json({ error: error.message }); // Return error message to the client
    }
  }

  /**
   * Handle user login.
   * Validates input, authenticates user, and generates a token.
   * @param {Object} req - The request object containing login credentials.
   * @param {Object} res - The response object.
   */
  async login(req, res) {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Login user via AuthService
      const token = await AuthService.login(req.body.email, req.body.password);

      // Log successful login
      logger.info(`✅ User logged in: ${req.body.email}`);

      res.json({ token }); // Respond with the JWT token
    } catch (error) {
      // Log login failure
      logger.error(`❌ Login failed for ${req.body.email}: ${error.message}`);

      res.status(401).json({ error: error.message }); // Return error message to the client
    }
  }
}

export default new AuthController();
