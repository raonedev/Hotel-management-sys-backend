// models/Employee.js
const mongoose = require('mongoose');

// --- Mongoose Employee Schema ---
// Defines the structure of an 'Employee' document in MongoDB
const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Each employee email must be unique
        trim: true,
        lowercase: true, // Store emails in lowercase
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Basic email validation
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        unique: true, // Each employee phone number must be unique
        match: [/^\+?\d{10,15}$/, 'Please fill a valid phone number'] // Basic phone number validation
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        enum: ['Manager', 'Receptionist', 'Housekeeping', 'Chef', 'Waiter', 'Security', 'Maintenance'], // Predefined positions
        default: 'Receptionist'
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary cannot be negative']
    },
    hireDate: {
        type: Date,
        default: Date.now // Automatically set hire date
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['Active', 'On Leave', 'Terminated'],
        default: 'Active'
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, trim: true }
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

// Pre-save hook to update the 'updatedAt' field on every save
employeeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Mongoose Model from the schema and export it
module.exports = mongoose.model('Employee', employeeSchema);
