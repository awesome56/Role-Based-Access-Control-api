import jwt from 'jsonwebtoken';
import winston from 'winston';
import User from '../models/User.js';

// Logger setup for tracking authentication events
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/auth.log' }) // Log authentication events
  ],
});

class AuthService {
  /**
   * Register a new user.
   * @param {string} email - User's email.
   * @param {string} password - User's plain text password.
   * @param {string} role - User's role (must be 'admin', 'shipper', or 'carrier').
   */
  async register(email, password, role) {
    try {
      // Validate role
      const validRoles = ['admin', 'shipper', 'carrier'];
      if (!validRoles.includes(role)) {
        logger.warn(`🚨 Invalid role attempted: ${role}`);
        throw new Error('Invalid role. Must be admin, shipper, or carrier.');
      }

      // Create new user using User model's method to handle password hashing
      const user = await User.createUser({ email, password, role });
      logger.info(`✅ User registered: ${email} (Role: ${role})`);
      return user;
    } catch (error) {
      logger.error(`❌ Registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authenticate user login.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   */
  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        logger.warn(`❌ Failed login attempt for email: ${email}`);
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user);
      logger.info(`✅ Successful login: ${email}`);
      return token;
    } catch (error) {
      logger.error(`🚨 Login error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a JWT token for authenticated users.
   * @param {Object} user - The user object containing ID and role.
   */
  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2h' } // Increased expiry time for better session handling
    );
  }
}

export default new AuthService();
