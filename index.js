// Import necessary modules
const express = require('express'); // Express.js for building the web server
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const bodyParser = require('body-parser'); // Body-parser to parse incoming request bodies
const cors = require('cors'); // CORS to allow cross-origin requests (useful for frontend integration)
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const salaryRoutes = require('./routes/salaryRoutes')
const authRoutes = require('./routes/authRoutes')


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Enable parsing of JSON request bodies
app.use(cors()); // Enable CORS for all routes

// --- MongoDB Connection ---
// Replace 'mongodb://localhost:27017/hotel_management' with your MongoDB connection string
// If you're running MongoDB locally, this default string should work.
// For production, consider using environment variables for your connection string.
const mongoURI = 'mongodb://localhost:27017/hotel_management';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/rooms',roomRoutes);
app.use('/api/booking',bookingRoutes);
app.use('/api/epmloyee',employeeRoutes);
app.use('/api/salary',salaryRoutes);
app.use('/api/user',authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});