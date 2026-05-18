const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const checkAuth = require('../middleware/authMiddleware');

router.post('/', checkAuth, employeeController.addEmployee);
router.get('/', checkAuth, employeeController.getEmployees);
router.get('/search', checkAuth, employeeController.searchEmployees);
router.delete('/:id', checkAuth, employeeController.deleteEmployee);
router.put('/:id/performance', checkAuth, employeeController.updatePerformance);

module.exports = router;
