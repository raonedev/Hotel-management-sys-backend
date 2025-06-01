// routes/salaryRoutes.js
const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController'); // Import the salary controller
const { protect, authorize } = require('../middleware/authMiddleware');

// Define routes and link them to controller functions for salaries
// To protect AND authorize a route (only authenticated users with 'admin' role can access)
router.post('/',protect, authorize('admin'), salaryController.createSalary);
router.get('/', protect, authorize('admin'), salaryController.getAllSalaries);
router.get('/:id', protect, authorize('admin'), salaryController.getSalaryById);
router.put('/:id', protect, authorize('admin'), salaryController.updateSalary);
router.delete('/:id', protect, authorize('admin'), salaryController.deleteSalary);

module.exports = router;
