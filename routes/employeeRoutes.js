// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); // Import the employee controller

// Define routes and link them to controller functions for employees
router.post('/', employeeController.createEmployee); // Route for creating a new employee
router.get('/', employeeController.getAllEmployees); // Route for getting all employees
router.get('/:id', employeeController.getEmployeeById); // Route for getting a single employee by ID
router.put('/:id', employeeController.updateEmployee); // Route for updating an employee by ID
router.delete('/:id', employeeController.deleteEmployee); // Route for deleting an employee by ID

module.exports = router; // Export the router
