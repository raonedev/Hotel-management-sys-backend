// models/Salary.js
const mongoose = require('mongoose');

// --- Mongoose Salary Schema ---
// Defines the structure of a 'Salary' document in MongoDB
const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Employee model
        ref: 'Employee', // The name of the model to which it refers
        required: [true, 'Employee ID is required']
    },
    amount: {
        type: Number,
        required: [true, 'Salary amount is required'],
        min: [0, 'Salary amount cannot be negative']
    },
    startDate: {
        type: Date,
        required: [true, 'Salary start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'Salary end date is required']
    },
    paymentDate: {
        type: Date,
        default: Date.now // Date when the salary was recorded/paid
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
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
salarySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Mongoose Model from the schema and export it
module.exports = mongoose.model('Salary', salarySchema);
