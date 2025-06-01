// controllers/authController.js
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // For generating JWTs

// Load environment variables
require('dotenv').config();

// --- Helper function to generate JWT ---
const generateToken = (id) => {
    // Sign the token with the user's ID and a secret key, set expiration
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// --- Register a new user ---
// Method: POST
// URL: /api/auth/signup
// Sample JSON Request Body (for a regular user):
/*
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
*/
// Sample JSON Request Body (for an admin - typically only for initial setup or internal use):
/*
{
    "username": "adminuser",
    "email": "admin@example.com",
    "password": "adminpassword",
    "role": "admin"
}
*/
exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists by email or username
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email or username already exists.' });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user' // Default to 'user' if role is not provided
        });

        // If user created successfully, generate a token and send response
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generate JWT
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

// --- Authenticate user and get token ---
// Method: POST
// URL: /api/auth/login
// Sample JSON Request Body:
/*
{
    "email": "test@example.com",
    "password": "password123"
}
*/
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email (include password field for comparison)
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generate JWT
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
