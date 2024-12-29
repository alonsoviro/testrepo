const userService = require('../services/userService'); // Import user service for handling user-related logic
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler'); // Import response handler utilities

/**
 * @module userController
 * 
 * This module defines the user-related controller functions for handling
 * user registration, login, profile retrieval, and profile updates.
 */

/**
 * Registers a new user.
 * 
 * @function registerUser
 * @param {Object} req - The request object from Express, containing user data in the body.
 * @param {Object} res - The response object from Express for sending responses.
 * @returns {void}
 * @access Public
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body; // Destructure user data from the request body

    try {
        // Call the userService to register the user and receive user data and token
        const { user, token } = await userService.registerUser(name, email, password);
        
        // Send a success response with user details and token
        sendSuccessResponse(res, { id: user._id, name: user.name, email: user.email, token }, 201);
    } catch (error) {
        // Send an error response if registration fails
        sendErrorResponse(res, error.message, 400);
    }
};

/**
 * Logs in a user.
 * 
 * @function loginUser
 * @param {Object} req - The request object from Express, containing user credentials in the body.
 * @param {Object} res - The response object from Express for sending responses.
 * @returns {void}
 * @access Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body; // Destructure user credentials from the request body

    try {
        // Call the userService to log in the user and receive user data and token
        const { user, token } = await userService.loginUser(email, password);
        
        // Send a success response with user details and token
        sendSuccessResponse(res, { id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        // Send an error response if login fails
        sendErrorResponse(res, error.message, 400);
    }
};

/**
 * Retrieves the profile of the authenticated user.
 * 
 * @function getUserProfile
 * @param {Object} req - The request object from Express, containing user information in req.user.
 * @param {Object} res - The response object from Express for sending responses.
 * @returns {void}
 * @access Private
 */
const getUserProfile = async (req, res) => {
    try {
        // Call the userService to get the user by ID from req.user
        const user = await userService.getUserById(req.user.id);
        
        // Send a success response with the user profile data
        sendSuccessResponse(res, user);
    } catch (error) {
        // Send an error response if user retrieval fails
        sendErrorResponse(res, error.message, 404);
    }
};

/**
 * Updates the profile of the authenticated user.
 * 
 * @function updateUserProfile
 * @param {Object} req - The request object from Express, containing updated user data in the body.
 * @param {Object} res - The response object from Express for sending responses.
 * @returns {void}
 * @access Private
 */
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body; // Destructure updated user data from the request body

    try {
        // Call the userService to update the user profile
        const user = await userService.updateUserProfile(req.user.id, { name, email });
        
        // Send a success response with the updated user profile data
        sendSuccessResponse(res, user);
    } catch (error) {
        // Send an error response if the update fails
        sendErrorResponse(res, error.message, 404);
    }
};

// Export the controller functions for use in routing
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};