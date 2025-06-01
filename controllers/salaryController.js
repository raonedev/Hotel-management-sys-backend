// controllers/salaryController.js
const Salary = require('../models/Salary'); // Import the Salary model
const Employee = require('../models/Employee'); // Import Employee model for validation

// Controller functions for CRUD operations

// Create a new salary record
// Method: POST
// URL: /api/salaries
// Sample JSON Request Body:
/*
{
    "employee": "60d5ec49c6d3a4001c7d1e8f", // Replace with an actual Employee ID
    "amount": 40000,
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T23:59:59.999Z",
    "status": "Paid",
    "notes": "January 2023 salary"
}
*/
exports.createSalary = async (req, res) => {
    try {
        // Validate if the employee exists
        const employeeExists = await Employee.findById(req.body.employee);
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found with the provided ID.' });
        }

        const newSalary = new Salary(req.body);
        const savedSalary = await newSalary.save();
        res.status(201).json(savedSalary);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error creating salary record:', error);
        res.status(500).json({ message: 'Server error while creating salary record.' });
    }
};

// Get all salary records (optionally populate employee details)
// Method: GET
// URL: /api/salaries
// Sample JSON Response (array of salary objects, with employee populated):
/*
[
    {
        "_id": "60d5ec49c6d3a4001c7d1e90",
        "employee": {
            "_id": "60d5ec49c6d3a4001c7d1e8f",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            // ... other employee details
        },
        "amount": 40000,
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-01-31T23:59:59.999Z",
        "paymentDate": "2023-02-05T00:00:00.000Z",
        "status": "Paid",
        "notes": "January 2023 salary",
        "createdAt": "2023-02-05T00:00:00.000Z",
        "updatedAt": "2023-02-05T00:00:00.000Z",
        "__v": 0
    }
]
*/
exports.getAllSalaries = async (req, res) => {
    try {
        // Use .populate('employee') to fetch employee details along with salary
        const salaries = await Salary.find({}).populate('employee', 'firstName lastName email position'); // Select specific fields to populate
        res.status(200).json(salaries);
    } catch (error) {
        console.error('Error fetching salary records:', error);
        res.status(500).json({ message: 'Server error while fetching salary records.' });
    }
};

// Get a single salary record by ID
// Method: GET
// URL: /api/salaries/:id
// Sample JSON Response (single salary object, with employee populated):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e90",
    "employee": {
        "_id": "60d5ec49c6d3a4001c7d1e8f",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "position": "Receptionist"
    },
    "amount": 40000,
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T23:59:59.999Z",
    "paymentDate": "2023-02-05T00:00:00.000Z",
    "status": "Paid",
    "notes": "January 2023 salary",
    "createdAt": "2023-02-05T00:00:00.000Z",
    "updatedAt": "2023-02-05T00:00:00.000Z",
    "__v": 0
}
*/
exports.getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id).populate('employee', 'firstName lastName email position');

        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found.' });
        }
        res.status(200).json(salary);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Salary ID format.' });
        }
        console.error('Error fetching salary record by ID:', error);
        res.status(500).json({ message: 'Server error while fetching salary record.' });
    }
};

// Update a salary record by ID
// Method: PUT
// URL: /api/salaries/:id
// Sample JSON Request Body (partial update):
/*
{
    "amount": 42000,
    "status": "Overdue"
}
*/
// Sample JSON Response (updated salary object):
/*
{
    "_id": "60d5ec49c6d3a4001c7d1e90",
    "employee": "60d5ec49c6d3a4001c7d1e8f",
    "amount": 42000,
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T23:59:59.999Z",
    "paymentDate": "2023-02-05T00:00:00.000Z",
    "status": "Overdue",
    "notes": "January 2023 salary",
    "createdAt": "2023-02-05T00:00:00.000Z",
    "updatedAt": "2023-10-27T11:00:00.000Z", // Updated timestamp
    "__v": 0
}
*/
exports.updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        // If employee ID is provided in update, validate it
        if (req.body.employee) {
            const employeeExists = await Employee.findById(req.body.employee);
            if (!employeeExists) {
                return res.status(404).json({ message: 'Employee not found with the provided ID.' });
            }
        }

        const updatedSalary = await Salary.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedSalary) {
            return res.status(404).json({ message: 'Salary record not found.' });
        }
        res.status(200).json(updatedSalary);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Salary ID format.' });
        }
        console.error('Error updating salary record:', error);
        res.status(500).json({ message: 'Server error while updating salary record.' });
    }
};

// Delete a salary record by ID
// Method: DELETE
// URL: /api/salaries/:id
// Sample JSON Response:
/*
{
    "message": "Salary record deleted successfully.",
    "deletedSalary": {
        "_id": "60d5ec49c6d3a4001c7d1e90",
        "employee": "60d5ec49c6d3a4001c7d1e8f",
        "amount": 40000,
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-01-31T23:59:59.999Z",
        "paymentDate": "2023-02-05T00:00:00.000Z",
        "status": "Paid",
        "notes": "January 2023 salary",
        "createdAt": "2023-02-05T00:00:00.000Z",
        "updatedAt": "2023-02-05T00:00:00.000Z",
        "__v": 0
    }
}
*/
exports.deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalary = await Salary.findByIdAndDelete(id);

        if (!deletedSalary) {
            return res.status(404).json({ message: 'Salary record not found.' });
        }
        res.status(200).json({ message: 'Salary record deleted successfully.', deletedSalary });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Salary ID format.' });
        }
        console.error('Error deleting salary record:', error);
        res.status(500).json({ message: 'Server error while deleting salary record.' });
    }
};
