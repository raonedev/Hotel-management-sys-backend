// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController'); // Import the booking controller
const { protect, authorize } = require('../middleware/authMiddleware');

// Define routes and link them to controller functions for bookings
router.post('/', bookingController.createBooking);
router.get('/',protect, authorize('admin'), bookingController.getAllBookings);
router.get('/:id',protect, bookingController.getBookingById);
router.put('/:id',protect, bookingController.updateBooking);
router.delete('/:id',protect, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
