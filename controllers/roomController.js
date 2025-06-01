// controllers/roomController.js
const Room = require('../models/Room.js'); // Import the Room model

// Controller functions for CRUD operations

// Create a new room
// Method: POST
// URL: /api/rooms
// Sample JSON Request Body:
/*
{
    "name": "Room 101",
    "category": "Standard",
    "price": 100,
    "capacity": 2,
    "bookingStatus": "Available",
    "description": "Cozy standard room with city view.",
    "amenities": ["WiFi", "AC", "TV"],
    "images": ["http://example.com/room101-pic1.jpg", "http://example.com/room101-pic2.jpg"]
}
*/
exports.createRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body); // Create a new Room instance with request body data
        const savedRoom = await newRoom.save(); // Save the room to the database
        res.status(201).json(savedRoom); // Respond with the created room and 201 status (Created)
    } catch (error) {
        // Handle validation errors or duplicate key errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Room with this name already exists.' });
        }
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Server error while creating room.' }); // Generic server error
    }
};

// Get all rooms
// Method: GET
// URL: /api/rooms
// Sample JSON Response (array of room objects):
/*
[
    {
        "_id": "60d5ec49c6d3a4001c7d1e8d",
        "name": "Room 101",
        "category": "Standard",
        "price": 100,
        "capacity": 2,
        "bookingStatus": "Available",
        "description": "Cozy standard room with city view.",
        "amenities": ["WiFi", "AC", "TV"],
        "images": ["http://example.com/room101-pic1.jpg", "http://example.com/room101-pic2.jpg"],
        "createdAt": "2023-10-27T10:00:00.000Z",
        "updatedAt": "2023-10-27T10:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "60d5ec49c6d3a4001c7d1e8e",
        "name": "Room 201",
        "category": "Deluxe",
        "price": 150,
        "capacity": 3,
        "bookingStatus": "Booked",
        "description": "Spacious deluxe room with balcony.",
        "amenities": ["WiFi", "AC", "TV", "Minibar"],
        "images": [],
        "createdAt": "2023-10-27T10:05:00.000Z",
        "updatedAt": "2023-10-27T10:05:00.000Z",
        "__v": 0
    }
]
*/
exports.getAllRooms = async (req, res) => {
    try {
        // Optional: Implement filtering, sorting, or pagination here if needed
        const rooms = await Room.find({}); // Find all rooms
        res.status(200).json(rooms); // Respond with all found rooms and 200 status (OK)
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Server error while fetching rooms.' });
    }
};

// Get a single room by ID
// Method: GET
// URL: /api/rooms/:id
// Sample JSON Response (single room object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e8d",
    "name": "Room 101",
    "category": "Standard",
    "price": 100,
    "capacity": 2,
    "bookingStatus": "Available",
    "description": "Cozy standard room with city view.",
    "amenities": ["WiFi", "AC", "TV"],
    "images": ["http://example.com/room101-pic1.jpg", "http://example.com/room101-pic2.jpg"],
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z",
    "__v": 0
}
*/
exports.getRoomById = async (req, res) => {
    try {
        const { id } = req.params; // Get the room ID from the request parameters
        const room = await Room.findById(id); // Find a room by its ID

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' }); // If room not found, respond with 404
        }
        res.status(200).json(room); // Respond with the found room
    } catch (error) {
        // Handle invalid ID format (e.g., not a valid MongoDB ObjectId)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Room ID format.' });
        }
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ message: 'Server error while fetching room.' });
    }
};

// Update a room by ID
// Method: PUT
// URL: /api/rooms/:id
// Sample JSON Request Body (partial update):
/*
{
    "price": 120,
    "bookingStatus": "Booked"
}
*/
// Sample JSON Response (updated room object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e8d",
    "name": "Room 101",
    "category": "Standard",
    "price": 120,
    "capacity": 2,
    "bookingStatus": "Booked",
    "description": "Cozy standard room with city view.",
    "amenities": ["WiFi", "AC", "TV"],
    "images": ["http://example.com/room101-pic1.jpg", "http://example.com/room101-pic2.jpg"],
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:15:00.000Z", // Updated timestamp
    "__v": 0
}
*/
exports.updateRoom = async (req, res) => {
    try {
        const { id } = req.params; // Get the room ID from the request parameters
        // Find the room by ID and update it with the request body data
        // `new: true` returns the updated document instead of the original
        // `runValidators: true` runs schema validators on update
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found.' }); // If room not found, respond with 404
        }
        res.status(200).json(updatedRoom); // Respond with the updated room
    } catch (error) {
        // Handle validation errors or invalid ID format
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Room ID format.' });
        }
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Room with this name already exists.' });
        }
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Server error while updating room.' });
    }
};

// Delete a room by ID
// Method: DELETE
// URL: /api/rooms/:id
// Sample JSON Response:
/*
{
    "message": "Room deleted successfully.",
    "deletedRoom": {
        "_id": "60d5ec49c6d3a4001c7d1e8d",
        "name": "Room 101",
        "category": "Standard",
        "price": 100,
        "capacity": 2,
        "bookingStatus": "Available",
        "description": "Cozy standard room with city view.",
        "amenities": ["WiFi", "AC", "TV"],
        "images": ["http://example.com/room101-pic1.jpg", "http://example.com/room101-pic2.jpg"],
        "createdAt": "2023-10-27T10:00:00.000Z",
        "updatedAt": "2023-10-27T10:00:00.000Z",
        "__v": 0
    }
}
*/
exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params; // Get the room ID from the request parameters
        const deletedRoom = await Room.findByIdAndDelete(id); // Find and delete the room by ID

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found.' }); // If room not found, respond with 404
        }
        res.status(200).json({ message: 'Room deleted successfully.', deletedRoom }); // Respond with success message
    } catch (error) {
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Room ID format.' });
        }
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Server error while deleting room.' });
    }
};