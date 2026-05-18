const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const checkAuth = require('../middleware/authMiddleware');

router.post('/recommend', checkAuth, aiController.getAIRecommendation);

module.exports = router;
