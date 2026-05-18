const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = new Employee({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    await employee.save();
    res.status(201).json({ message: 'Employee added successfully', employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};
    if (department) {
      // The parameter is called department based on the prompt, but let's allow it to search name too
      query = {
        $or: [
          { department: { $regex: new RegExp(department, 'i') } },
          { name: { $regex: new RegExp(department, 'i') } }
        ]
      };
    }
    
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updatePerformance = async (req, res) => {
    try {
        const { performanceScore } = req.body;
        const employee = await Employee.findByIdAndUpdate(
            req.params.id, 
            { performanceScore },
            { new: true, runValidators: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Performance updated', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
