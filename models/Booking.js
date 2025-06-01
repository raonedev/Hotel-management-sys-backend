// models/Booking.js
const mongoose = require('mongoose');

// --- Mongoose Booking Schema ---
// Defines the structure of a 'Booking' document in MongoDB
const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Room model
        ref: 'Room', // The name of the model to which it refers
        required: [true, 'Room ID is required']
    },
    guestName: {
        type: String,
        required: [true, 'Guest name is required'],
        trim: true
    },
    guestEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    guestPhoneNumber: {
        type: String,
        trim: true,
        match: [/^\+?\d{10,15}$/, 'Please fill a valid phone number']
    },
    checkInDate: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkOutDate: {
        type: Date,
        required: [true, 'Check-out date is required']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total booking amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: [0, 'Paid amount cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
        default: 'Pending'
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled', 'Checked-In', 'Checked-Out'],
        default: 'Pending'
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save hook to update the 'updatedAt' field
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add a validation to ensure checkOutDate is after checkInDate
bookingSchema.path('checkOutDate').validate(function(value) {
    return this.checkInDate <= value;
}, 'Check-out date must be after or same as check-in date.');


// Create the Mongoose Model from the schema and export it
module.exports = mongoose.model('Booking', bookingSchema);
