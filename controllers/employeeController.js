// controllers/employeeController.js
const Employee = require('../models/Employee'); // Import the Employee model

// Controller functions for CRUD operations

// Create a new employee
// Method: POST
// URL: /api/employees
// Sample JSON Request Body:
/*
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+15551234567",
    "position": "Receptionist",
    "salary": 35000,
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    }
}
*/
exports.createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) { // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `Employee with this ${field} already exists.` });
        }
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Server error while creating employee.' });
    }
};

// Get all employees
// Method: GET
// URL: /api/employees
// Sample JSON Response (array of employee objects):
/*
[
    {
        "_id": "60d5ec49c6d3a4001c7d1e8f",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+15551234567",
        "position": "Receptionist",
        "salary": 35000,
        "hireDate": "2023-01-15T00:00:00.000Z",
        "status": "Active",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zipCode": "90210",
            "country": "USA"
        },
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z",
        "__v": 0
    }
]
*/
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
};

// Get a single employee by ID
// Method: GET
// URL: /api/employees/:id
// Sample JSON Response (single employee object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e8f",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+15551234567",
    "position": "Receptionist",
    "salary": 35000,
    "hireDate": "2023-01-15T00:00:00.000Z",
    "status": "Active",
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    },
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "__v": 0
}
*/
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json(employee);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Employee ID format.' });
        }
        console.error('Error fetching employee by ID:', error);
        res.status(500).json({ message: 'Server error while fetching employee.' });
    }
};

// Update an employee by ID
// Method: PUT
// URL: /api/employees/:id
// Sample JSON Request Body (partial update):
/*
{
    "position": "Manager",
    "salary": 50000,
    "status": "On Leave"
}
*/
// Sample JSON Response (updated employee object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e8f",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+15551234567",
    "position": "Manager",
    "salary": 50000,
    "hireDate": "2023-01-15T00:00:00.000Z",
    "status": "On Leave",
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    },
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-10-27T10:30:00.000Z", // Updated timestamp
    "__v": 0
}
*/
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Employee ID format.' });
        }
        if (error.code === 11000) { // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `Employee with this ${field} already exists.` });
        }
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server error while updating employee.' });
    }
};

// Delete an employee by ID
// Method: DELETE
// URL: /api/employees/:id
// Sample JSON Response:
/*
{
    "message": "Employee deleted successfully.",
    "deletedEmployee": {
        "_id": "60d5ec49c6d3a4001c7d1e8f",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+15551234567",
        "position": "Receptionist",
        "salary": 35000,
        "hireDate": "2023-01-15T00:00:00.000Z",
        "status": "Active",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zipCode": "90210",
            "country": "USA"
        },
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z",
        "__v": 0
    }
}
*/
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee deleted successfully.', deletedEmployee });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Employee ID format.' });
        }
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error while deleting employee.' });
    }
};
