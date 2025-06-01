// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// --- Mongoose User Schema ---
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define possible roles
        default: 'user' // Default role for new users
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

// --- Mongoose Middleware (Pre-save hook for password hashing) ---
// This runs before a user document is saved to the database.
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt (random string) and hash the password
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance for security and performance
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Instance method to compare entered password with hashed password ---
// This method will be available on user documents.
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Compare the entered password with the hashed password stored in the database
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Mongoose Model from the schema and export it
module.exports = mongoose.model('User', userSchema);
