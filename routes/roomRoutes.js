// routes/roomRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express Router instance
const roomController = require('../controllers/roomController'); // Import the room controller

// Define routes and link them to controller functions
router.post('/', roomController.createRoom); // Route for creating a new room
router.get('/', roomController.getAllRooms); // Route for getting all rooms
router.get('/:id', roomController.getRoomById); // Route for getting a single room by ID
router.put('/:id', roomController.updateRoom); // Route for updating a room by ID
router.delete('/:id', roomController.deleteRoom); // Route for deleting a room by ID

module.exports = router; // Export the router
