const Application = require('../models/application.model');
const {
  generateCibilScore,
  calculateCreditLimit,
  checkAgeEligibility,
  checkCibilEligibility,
  generateApplicationNumber,
} = require('../utils/cibilScore.utils');

// Submit new application
const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      pan,
      annualIncome,
      email,
      phone,
      profession,
      address,
      cardType = 'VISA'
    } = req.body;

    // Validate required fields
    if (!fullName || !dob || !pan || !annualIncome || !email || !phone || !profession || !address) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check age eligibility
    const ageEligibility = checkAgeEligibility(dob);
    if (!ageEligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: ageEligibility.message,
        reason: ageEligibility.reason
      });
    }

    // Check for duplicate PAN
    const existingApplication = await Application.findOne({ 'applicant.pan': pan.toUpperCase() });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this PAN already exists',
        applicationId: existingApplication.applicationNumber
      });
    }

    // Build applicant object for CIBIL score calculation
    const applicantData = {
      fullName,
      dob,
      pan: pan.toUpperCase(),
      annualIncome: Number(annualIncome),
      email,
      phone,
      profession,
      address
    };

    // Generate CIBIL score based on applicant details
    const creditScore = generateCibilScore(applicantData);

    // Check CIBIL eligibility
    const cibilEligibility = checkCibilEligibility(creditScore);
    if (!cibilEligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: cibilEligibility.message,
        reason: cibilEligibility.reason,
        creditScore
      });
    }

    // Calculate credit limit based on CIBIL score and income
    const creditLimit = calculateCreditLimit(creditScore, Number(annualIncome));

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    // Create new application
    const application = new Application({
      applicationNumber,
      cardType: cardType.toUpperCase(),
      status: 'PENDING',
      creditScore,
      creditLimit,
      applicant: {
        fullName,
        dob: new Date(dob),
        pan: pan.toUpperCase(),
        annualIncome: Number(annualIncome),
        email,
        phone,
        profession: {
          type: profession.type,
          company: profession.company || 'NOT_APPLIED'
        },
        address: {
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          pin: Number(address.pin)
        }
      },
      statusHistory: [{
        status: 'PENDING',
        changedAt: new Date(),
        changedBy: 'APPROVER',
        reason: 'Application submitted by customer'
      }]
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: applicationNumber,
        fullName,
        status: 'PENDING',
        creditScore,
        creditLimit,
        submittedAt: application.createdAt
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({ applicationNumber: applicationId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getApplicationById
};
