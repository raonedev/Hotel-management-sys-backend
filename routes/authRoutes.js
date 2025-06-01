// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the auth controller

// Define authentication routes
router.post('/signup', authController.signup); // Route for user registration
router.post('/login', authController.login);   // Route for user login

module.exports = router;
