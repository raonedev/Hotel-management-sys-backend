// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); // Import the employee controller
const { protect, authorize } = require('../middleware/authMiddleware');

// Define routes and link them to controller functions for employees
router.post('/',protect, authorize('admin'), employeeController.createEmployee); // Route for creating a new employee
router.get('/',protect, authorize('admin'), employeeController.getAllEmployees); // Route for getting all employees
router.get('/:id',protect, authorize('admin'), employeeController.getEmployeeById); // Route for getting a single employee by ID
router.put('/:id',protect, authorize('admin'), employeeController.updateEmployee); // Route for updating an employee by ID
router.delete('/:id',protect, authorize('admin'), employeeController.deleteEmployee); // Route for deleting an employee by ID

module.exports = router; // Export the router
