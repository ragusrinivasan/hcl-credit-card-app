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

// @desc    Update application status
// @route   PATCH /api/v1/application/:applicationNumber/status
// @access  Private (Approver only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationNumber } = req.params;
        const { status, rejectionReason } = req.body;

        const validStatuses = ['SUBMITTED', 'CHECK_IN_PROGRESS', 'APPROVED', 'REJECTED', 'DISPATCHED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
            });
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required when rejecting an application',
            });
        }
        const application = await Application.findOne({ applicationNumber });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Update status
        application.status = status;
        application.rejectionReason = status === 'REJECTED' ? rejectionReason : null;

        // Add to status history
        application.statusHistory.push({
            status,
            changedAt: new Date(),
            changedBy: 'APPROVER',
            reason: status === 'REJECTED' ? rejectionReason : `Status changed to ${status}`,
        });

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: {
                applicationNumber: application.applicationNumber,
                status: application.status,
                rejectionReason: application.rejectionReason,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message,
        });
    }
};



exports.getApplicationById = async (req, res) => {
    try {
        console.log(req.params.id)
        const applicationId = req.params.id;
        const application = await Application.findOne({applicationNumber :applicationId})
               
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }
        res.status(200).json({
            success: true,
            data: application,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error fetching application',})
    }
};