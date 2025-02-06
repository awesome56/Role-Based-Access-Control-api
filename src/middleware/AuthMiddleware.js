import jwt from 'jsonwebtoken';
import winston from 'winston';

// Logger for tracking authentication attempts and errors
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/auth.log' }) // Log authentication events
  ],
});

class AuthMiddleware {
  /**
   * Middleware to authenticate users via JWT.
   * Extracts the token from the Authorization header and verifies it.
   */
  authenticate(req, res, next) {
    try {
      // Extract the token from the Authorization header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        logger.warn(`Unauthorized access attempt from IP: ${req.ip}`);
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      // Verify the token
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      logger.error(`Invalid token from IP: ${req.ip} - ${error.message}`);
      res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
  }

  /**
   * Middleware to check if a user has the required role.
   * Ensures only authorized roles can access specific endpoints.
   */
  checkRole(roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        logger.warn(
          `Forbidden access attempt by ${req.user.email} (Role: ${req.user.role}) to ${req.originalUrl}`
        );
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  }
}

export default new AuthMiddleware();
