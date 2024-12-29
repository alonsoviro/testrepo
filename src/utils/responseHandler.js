/**
 * responseHandler.js
 * 
 * This module provides utility functions for sending standardized responses
 * from an Express.js API. It helps maintain consistency in the response format,
 * making it easier for clients to handle responses.
 */

/**
 * Sends a success response.
 * 
 * @param {Object} res - The response object from Express.
 * @param {Object} data - The data to send in the response.
 * @param {number} [statusCode=200] - The HTTP status code (default is 200).
 */
const sendSuccessResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true, // Indicates that the request was successful
        data, // The data to be returned to the client
    });
};

/**
 * Sends an error response.
 * 
 * @param {Object} res - The response object from Express.
 * @param {string} message - The error message to send.
 * @param {number} [statusCode=500] - The HTTP status code (default is 500).
 */
const sendErrorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        success: false, // Indicates that the request failed
        message, // The error message to be returned to the client
    });
};

// Export the response handler functions for use in other modules
module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
};