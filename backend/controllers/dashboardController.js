const Dashboard = require('../models/Dashboard');

/**
 * @desc    Retrieve Dashboard Data
 * @route   GET /api/dashboard
 * @access  Public (Authentication module to be implemented in later phases)
 */
const getDashboardData = async (req, res) => {
  try {
    // Retrieve the dashboard document from MongoDB
    const dashboard = await Dashboard.findOne();

    // Check if dashboard document exists
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'No dashboard document found'
      });
    }

    // Return the complete dashboard object as JSON
    return res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    // Graceful error handling
    console.error(`Error retrieving dashboard data: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to retrieve dashboard data',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData
};
