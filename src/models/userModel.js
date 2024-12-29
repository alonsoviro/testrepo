const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling
const { Schema } = mongoose; // Destructure Schema from Mongoose

/**
 * @module userModel
 * 
 * This module defines the User schema and model for MongoDB using Mongoose.
 * The User model represents the user data structure and provides methods
 * for interacting with the user collection in the database.
 */

// Define the User schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true, // Name is a required field
        trim: true, // Trim whitespace from the beginning and end
    },
    email: {
        type: String,
        required: true, // Email is a required field
        unique: true, // Email must be unique across users
        lowercase: true, // Convert email to lowercase
        trim: true, // Trim whitespace from the beginning and end
    },
    password: {
        type: String,
        required: true, // Password is a required field
        minlength: 6, // Minimum length of password
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

/**
 * @function
 * @name User
 * @description The User model for interacting with the users collection in MongoDB.
 * @returns {Object} Mongoose model for the User schema.
 */
const User = mongoose.model('User', userSchema);

// Export the User model for use in other modules
module.exports = User;