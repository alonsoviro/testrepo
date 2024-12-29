const express = require('express'); // Import Express framework
const userController = require('../controllers/userController'); // Import user controller for handling user-related logic
const { authenticate } = require('../middleware/authMiddleware'); // Import authentication middleware
const router = express.Router(); // Create a new router instance

/**
 * @module userRoutes
 * 
 * This module defines the routes for user-related operations, including registration,
 * login, fetching user profiles, and updating user information.
 */

/**
 * @route POST /api/users/register
 * @group Users - User operations
 * @param {string} name.body.required - The name of the user
 * @param {string} email.body.required - The email of the user
 * @param {string} password.body.required - The password of the user
 * @returns {Object} 200 - An object containing user data and a JWT token
 * @returns {Object} 400 - An error message if registration fails
 * @returns {Object} 500 - An error message for server errors
 */
router.post('/register', userController.registerUser);

/**
 * @route POST /api/users/login
 * @group Users - User operations
 * @param {string} email.body.required - The email of the user
 * @param {string} password.body.required - The password of the user
 * @returns {Object} 200 - An object containing user data and a JWT token
 * @returns {Object} 401 - An error message if login fails due to invalid credentials
 * @returns {Object} 500 - An error message for server errors
 */
router.post('/login', userController.loginUser);

/**
 * @route GET /api/users/profile
 * @group Users - User operations
 * @param {string} Authorization.header.required - Bearer token for authentication
 * @returns {Object} 200 - The user profile data
 * @returns {Object} 404 - An error message if user is not found
 * @returns {Object} 500 - An error message for server errors
 */
router.get('/profile', authenticate, userController.getUserProfile);

/**
 * @route PUT /api/users/profile
 * @group Users - User operations
 * @param {string} Authorization.header.required - Bearer token for authentication
 * @param {Object} updates.body.required - The fields to update (e.g., name, email)
 * @returns {Object} 200 - The updated user profile data
 * @returns {Object} 404 - An error message if user is not found
 * @returns {Object} 500 - An error message for server errors
 */
router.put('/profile', authenticate, userController.updateUserProfile);

// Export the router for use in the main application
module.exports = router;