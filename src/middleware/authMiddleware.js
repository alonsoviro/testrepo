const jwt = require('jsonwebtoken'); // Import jsonwebtoken for verifying JWT tokens

/**
 * @module authMiddleware
 * 
 * This module defines middleware for protecting routes by verifying JWT tokens.
 * It ensures that only authenticated users can access certain routes in the application.
 */

/**
 * Middleware function to protect routes by verifying JWT tokens.
 * 
 * @function authMiddleware
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} 401 - An error message if the token is missing or invalid.
 */
const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, respond with a 401 Unauthorized status
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user information to the request object for use in subsequent handlers
        req.user = decoded; 
        
        // Call the next middleware or route handler
        next(); 
    } catch (error) {
        // If token verification fails, respond with a 401 Unauthorized status
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Export the authMiddleware function for use in other modules
module.exports = authMiddleware;
