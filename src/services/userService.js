const User = require('../models/userModel'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating tokens

/**
 * userService.js
 * 
 * This module provides services for user management, including registration,
 * login, fetching user profiles, and updating user information.
 */

/**
 * Registers a new user.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The plain text password of the user.
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing the user and a JWT token.
 * @throws Will throw an error if the user already exists.
 */
const registerUser = async (name, email, password) => {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists'); // Throw an error if the user is found
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Create a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return the user data and token
    return { user, token };
};

/**
 * Logs in a user.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The plain text password of the user.
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing the user and a JWT token.
 * @throws Will throw an error if credentials are invalid.
 */
const loginUser = async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials'); // Throw an error if the user is not found
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials'); // Throw an error if the password does not match
    }

    // Create a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return the user data and token
    return { user, token };
};

/**
 * Fetches a user by their ID.
 * 
 * @param {string} id - The ID of the user.
 * @returns {Promise<Object>} - Returns a promise that resolves to the user object.
 * @throws Will throw an error if the user is not found.
 */
const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found'); // Throw an error if the user is not found
    }
    return user; // Return the found user
};

/**
 * Updates a user's profile.
 * 
 * @param {string} id - The ID of the user.
 * @param {Object} updates - An object containing the fields to update.
 * @returns {Promise<Object>} - Returns a promise that resolves to the updated user object.
 * @throws Will throw an error if the user is not found.
 */
const updateUserProfile = async (id, updates) => {
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!user) {
        throw new Error('User not found'); // Throw an error if the user is not found
    }
    return user; // Return the updated user
};

// Export the user service functions for use in other modules
module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUserProfile,
};