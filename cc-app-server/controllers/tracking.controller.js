const Tracking = require('../models/tracking.model');

exports.getTrackingstatus = async (req, res) => {
    try {
        const trackingstatus = await Tracking.find()
            .select('-__v')
            .sort({ changedAt: -1 }) // sort by changedAt since that's in your schema
            .lean();

        res.status(200).json({
            success: true,
            data: trackingstatus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};
