// models/Room.js
const mongoose = require('mongoose');

// --- Mongoose Room Schema ---
// Defines the structure of a 'Room' document in MongoDB
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required'], // Room name is mandatory
        unique: true, // Each room name must be unique
        trim: true // Remove whitespace from both ends of a string
    },
    category: {
        type: String,
        required: [true, 'Room category is required'], // Category (e.g., Standard, Deluxe, Suite) is mandatory
        enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Executive'], // Predefined categories
        default: 'Standard' // Default category if not specified
    },
    price: {
        type: Number,
        required: [true, 'Room price is required'], // Price per night is mandatory
        min: [0, 'Price cannot be negative'] // Price must be a non-negative number
    },
    capacity: {
        type: Number,
        required: [true, 'Room capacity is required'], // Max number of guests
        min: [1, 'Capacity must be at least 1'] // Capacity must be at least 1
    },
    bookingStatus: {
        type: String,
        required: [true, 'Booking status is required'], // Current booking status
        enum: ['Available', 'Booked', 'Under Maintenance'], // Predefined statuses
        default: 'Available' // Default status
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'] // Optional description with max length
    },
    amenities: {
        type: [String], // Array of strings for amenities (e.g., 'AC', 'WiFi', 'TV')
        default: [] // Default to an empty array
    },
    images: {
        type: [String], // Array of strings for image URLs
        default: [] // Default to an empty array
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set creation timestamp
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set update timestamp
    }
});

// Pre-save hook to update the 'updatedAt' field on every save
roomSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Mongoose Model from the schema and export it
module.exports = mongoose.model('Room', roomSchema);
