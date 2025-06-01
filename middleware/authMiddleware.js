// middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); // For working with JSON Web Tokens
const User = require('../models/User'); // Import the User model

// Load environment variables (e.g., JWT_SECRET)
// It's good practice to use a .env file for secrets in development.
// In production, configure environment variables directly.
require('dotenv').config();

// --- Protect Middleware ---
// This middleware checks if a user is authenticated (has a valid JWT).
exports.protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the 'Bearer <token>' string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the decoded token payload
            // .select('-password') excludes the password field from the returned user object
            req.user = await User.findById(decoded.id).select('-password');

            // If user is not found (e.g., deleted after token was issued)
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Token verification error:', error);
            // Handle various JWT errors (e.g., invalid token, expired token)
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Not authorized, token failed.' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired.' });
            }
            res.status(500).json({ message: 'Server error during token verification.' });
        }
    }

    // If no token is provided in the header
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

// --- Authorize Middleware ---
// This middleware checks if the authenticated user has one of the allowed roles.
// It takes an array of roles (e.g., ['admin', 'manager']) as arguments.
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the authenticated user's role is included in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route.`
            });
        }
        next(); // Proceed to the next middleware/route handler
    };
};
