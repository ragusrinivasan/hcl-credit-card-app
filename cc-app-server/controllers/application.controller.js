const Application = require('../models/application.model');

// @desc    Get all applications
// @route   GET /applications
// @access  Public
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};

module.exports = {
    getAllApplications,
};