const Application = require('../models/application.model');


exports.getAllApplications = async (req, res) => {
    try {
        const { 
            search, 
            status, 
            cardType, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;
        
        // Parse pagination params
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (pageNum - 1) * limitNum;
        
        // Build filter query
        const query = {};
        
        // Filter by status
        if (status && status !== 'ALL') {
            query.status = status;
        }
        
        // Filter by card type
        if (cardType && cardType !== 'ALL') {
            query.cardType = cardType;
        }
        
        // Search across multiple fields
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { applicationNumber: searchRegex },
                { 'applicant.fullName': searchRegex },
                { 'applicant.email': searchRegex },
                { 'applicant.phone': searchRegex },
                { 'applicant.pan': searchRegex },
            ];
        }
        
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Get total count for pagination
        const totalCount = await Application.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNum);

        const applications = await Application.find(query)
            .select('-__v')
            .sort(sortObject)
            .skip(skip)
            .limit(limitNum)
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
            totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
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

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationNumber } = req.params;
        const { status, rejectionReason, creditLimit } = req.body;

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
        if(creditLimit){
            application.creditLimit = creditLimit;
        }
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