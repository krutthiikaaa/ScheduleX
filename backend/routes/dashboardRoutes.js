const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDashboardData } = require('../controllers/dashboardController');

// @route   GET /api/dashboard
// @desc    Get dashboard foundation data
router.get('/', auth, getDashboardData);

module.exports = router;
