/**
 * CIBIL Score Generator Utility
 * Generates a simulated CIBIL score based on applicant details
 * In production, this would connect to actual CIBIL/credit bureau APIs
 */

/**
 * Generate CIBIL score based on applicant details
 * Score range: 300 - 900 (as per CIBIL standards)
 * @param {Object} applicant - Applicant details
 * @returns {number} - Generated CIBIL score
 */
const generateCibilScore = (applicant) => {
    let baseScore = 550; // Start with a base score

    // Factor 1: Age (calculated from DOB)
    const age = calculateAge(applicant.dob);
    if (age >= 25 && age <= 35) {
        baseScore += 50; // Prime earning age
    } else if (age >= 36 && age <= 50) {
        baseScore += 70; // Stable income age
    } else if (age >= 51 && age <= 60) {
        baseScore += 40; // Pre-retirement
    } else if (age < 25) {
        baseScore += 20; // Young, less credit history
    } else {
        baseScore += 30; // Senior citizen
    }

    // Factor 2: Annual Income
    const income = applicant.annualIncome;
    if (income >= 1500000) {
        baseScore += 100; // High income
    } else if (income >= 1000000) {
        baseScore += 80;
    } else if (income >= 500000) {
        baseScore += 60;
    } else if (income >= 300000) {
        baseScore += 40;
    } else {
        baseScore += 20;
    }

    // Factor 3: Employment Type
    if (applicant.profession?.type === 'SALARIED') {
        baseScore += 50; // Stable income
    } else if (applicant.profession?.type === 'SELF_EMPLOYED') {
        baseScore += 30; // Variable income
    }

    // Factor 4: Add some randomness to simulate real-world variation
    const randomVariation = Math.floor(Math.random() * 100) - 50; // -50 to +50
    baseScore += randomVariation;

    // Ensure score is within CIBIL range (300-900)
    return Math.max(300, Math.min(900, baseScore));
};


const calculateCreditLimit = (cibilScore, annualIncome) => {
    let multiplier = 0;

    // Determine multiplier based on CIBIL score
    if (cibilScore >= 800) {
        multiplier = 3; // Excellent score
    } else if (cibilScore >= 750) {
        multiplier = 2.5; // Very good score
    } else if (cibilScore >= 700) {
        multiplier = 2; // Good score
    } else if (cibilScore >= 650) {
        multiplier = 1.5; // Fair score
    } else if (cibilScore >= 600) {
        multiplier = 1; // Below average
    } else {
        multiplier = 0.5; // Poor score
    }

    // Calculate monthly income
    const monthlyIncome = annualIncome / 12;

    // Credit limit is multiplier times monthly income
    let creditLimit = Math.round(monthlyIncome * multiplier);

    // Round to nearest 5000
    creditLimit = Math.round(creditLimit / 5000) * 5000;

    // Set minimum and maximum limits
    creditLimit = Math.max(25000, creditLimit); // Minimum 25,000
    creditLimit = Math.min(500000, creditLimit); // Maximum 5,00,000

    return creditLimit;
};


const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};


const checkAgeEligibility = (dob) => {
    const age = calculateAge(dob);

    if (age < 21) {
        return {
            eligible: false,
            reason: 'AGE_NOT_ELIGIBLE',
            message: 'Applicant must be at least 21 years old',
        };
    }

    if (age > 65) {
        return {
            eligible: false,
            reason: 'AGE_NOT_ELIGIBLE',
            message: 'Applicant must be 65 years or younger',
        };
    }

    return {
        eligible: true,
        reason: null,
        message: 'Age eligibility check passed',
    };
};

/**
 * Check if CIBIL score is acceptable for credit card
 * @param {number} cibilScore - CIBIL score
 * @returns {Object} - Eligibility status
 */
const checkCibilEligibility = (cibilScore) => {
    if (cibilScore < 550) {
        return {
            eligible: false,
            reason: 'LOW_CREDIT_SCORE',
            message: 'CIBIL score is below minimum requirement of 550',
        };
    }

    return {
        eligible: true,
        reason: null,
        message: 'CIBIL score check passed',
    };
};

/**
 * Generate application number
 * Format: APP-YYYY-XXXXX (e.g., APP-2026-00001)
 * @returns {string} - Application number
 */
const generateApplicationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `APP-${year}-${random}`;
};

module.exports = {
    generateCibilScore,
    calculateCreditLimit,
    calculateAge,
    checkAgeEligibility,
    checkCibilEligibility,
    generateApplicationNumber,
};
