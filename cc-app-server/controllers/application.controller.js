const Application = require('../models/application.model');


exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean();

        // Remove _id from nested objects
        const cleanedApplications = applications.map((app) => {
            const { _id, ...appWithoutId } = app;

            // Clean applicant
            if (appWithoutId.applicant) {
                const { _id: applicantId, ...applicantRest } = appWithoutId.applicant;
                appWithoutId.applicant = applicantRest;

                // Clean profession
                if (appWithoutId.applicant.profession) {
                    const { _id: profId, ...profRest } = appWithoutId.applicant.profession;
                    appWithoutId.applicant.profession = profRest;
                }

                // Clean address
                if (appWithoutId.applicant.address) {
                    const { _id: addrId, ...addrRest } = appWithoutId.applicant.address;
                    appWithoutId.applicant.address = addrRest;
                }
            }

            // Clean statusHistory
            if (appWithoutId.statusHistory) {
                appWithoutId.statusHistory = appWithoutId.statusHistory.map((status) => {
                    const { _id, ...statusRest } = status;
                    return statusRest;
                });
            }

            return appWithoutId;
        });

        res.status(200).json({
            success: true,
            count: cleanedApplications.length,
            data: cleanedApplications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};
