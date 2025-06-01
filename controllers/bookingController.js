// controllers/bookingController.js
const Booking = require('../models/Booking'); // Import the Booking model
const Room = require('../models/Room'); // Import Room model for validation

// Controller functions for CRUD operations

// Create a new booking
// Method: POST
// URL: /api/bookings
// Sample JSON Request Body:
/*
{
    "room": "60d5ec49c6d3a4001c7d1e8d", // Replace with an actual Room ID
    "guestName": "Jane Smith",
    "guestEmail": "jane.smith@example.com",
    "guestPhoneNumber": "+15559876543",
    "checkInDate": "2023-11-01T14:00:00.000Z",
    "checkOutDate": "2023-11-05T11:00:00.000Z",
    "totalAmount": 400,
    "paidAmount": 200,
    "paymentStatus": "Partially Paid",
    "bookingStatus": "Confirmed",
    "notes": "Early check-in requested"
}
*/
exports.createBooking = async (req, res) => {
    try {
        // Validate if the room exists
        const roomExists = await Room.findById(req.body.room);
        if (!roomExists) {
            return res.status(404).json({ message: 'Room not found with the provided ID.' });
        }

        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
};

// Get all bookings (optionally populate room details)
// Method: GET
// URL: /api/bookings
// Sample JSON Response (array of booking objects, with room populated):
/*
[
    {
        "_id": "60d5ec49c6d3a4001c7d1e91",
        "room": {
            "_id": "60d5ec49c6d3a4001c7d1e8d",
            "name": "Room 101",
            "category": "Standard",
            "price": 100,
            // ... other room details
        },
        "guestName": "Jane Smith",
        "guestEmail": "jane.smith@example.com",
        "checkInDate": "2023-11-01T14:00:00.000Z",
        "checkOutDate": "2023-11-05T11:00:00.000Z",
        "totalAmount": 400,
        "paidAmount": 200,
        "paymentStatus": "Partially Paid",
        "bookingStatus": "Confirmed",
        "createdAt": "2023-10-27T11:30:00.000Z",
        "updatedAt": "2023-10-27T11:30:00.000Z",
        "__v": 0
    }
]
*/
exports.getAllBookings = async (req, res) => {
    try {
        // Use .populate('room') to fetch room details along with booking
        const bookings = await Booking.find({}).populate('room', 'name category price');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
};

// Get a single booking by ID
// Method: GET
// URL: /api/bookings/:id
// Sample JSON Response (single booking object, with room populated):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e91",
    "room": {
        "_id": "60d5ec49c6d3a4001c7d1e8d",
        "name": "Room 101",
        "category": "Standard",
        "price": 100
    },
    "guestName": "Jane Smith",
    "guestEmail": "jane.smith@example.com",
    "checkInDate": "2023-11-01T14:00:00.000Z",
    "checkOutDate": "2023-11-05T11:00:00.000Z",
    "totalAmount": 400,
    "paidAmount": 200,
    "paymentStatus": "Partially Paid",
    "bookingStatus": "Confirmed",
    "createdAt": "2023-10-27T11:30:00.000Z",
    "updatedAt": "2023-10-27T11:30:00.000Z",
    "__v": 0
}
*/
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('room', 'name category price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Booking ID format.' });
        }
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ message: 'Server error while fetching booking.' });
    }
};

// Update a booking by ID
// Method: PUT
// URL: /api/bookings/:id
// Sample JSON Request Body (partial update):
/*
{
    "paidAmount": 400,
    "paymentStatus": "Paid",
    "bookingStatus": "Checked-In"
}
*/
// Sample JSON Response (updated booking object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e91",
    "room": "60d5ec49c6d3a4001c7d1e8d",
    "guestName": "Jane Smith",
    "guestEmail": "jane.smith@example.com",
    "checkInDate": "2023-11-01T14:00:00.000Z",
    "checkOutDate": "2023-11-05T11:00:00.000Z",
    "totalAmount": 400,
    "paidAmount": 400,
    "paymentStatus": "Paid",
    "bookingStatus": "Checked-In",
    "createdAt": "2023-10-27T11:30:00.000Z",
    "updatedAt": "2023-10-27T11:45:00.000Z", // Updated timestamp
    "__v": 0
}
*/
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        // If room ID is provided in update, validate it
        if (req.body.room) {
            const roomExists = await Room.findById(req.body.room);
            if (!roomExists) {
                return res.status(404).json({ message: 'Room not found with the provided ID.' });
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Booking ID format.' });
        }
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error while updating booking.' });
    }
};

// Delete a booking by ID
// Method: DELETE
// URL: /api/bookings/:id
// Sample JSON Response:
/*
{
    "message": "Booking deleted successfully.",
    "deletedBooking": {
        "_id": "60d5ec49c6d3a4001c7d1e91",
        "room": "60d5ec49c6d3a4001c7d1e8d",
        "guestName": "Jane Smith",
        "guestEmail": "jane.smith@example.com",
        "checkInDate": "2023-11-01T14:00:00.000Z",
        "checkOutDate": "2023-11-05T11:00:00.000Z",
        "totalAmount": 400,
        "paidAmount": 200,
        "paymentStatus": "Partially Paid",
        "bookingStatus": "Confirmed",
        "createdAt": "2023-10-27T11:30:00.000Z",
        "updatedAt": "2023-10-27T11:30:00.000Z",
        "__v": 0
    }
}
*/
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json({ message: 'Booking deleted successfully.', deletedBooking });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Booking ID format.' });
        }
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error while deleting booking.' });
    }
};
