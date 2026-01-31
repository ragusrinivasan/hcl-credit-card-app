# hcl-credit-card-app
Repository for HCL hackathon credit card application


# Credit Card Application System (MERN)

Hackathon Project – 31 Jan 2026  
A full-stack Credit Card Application System built using the **MERN stack**, designed with real-world banking workflows, auditability, and scalability in mind.

---

## Problem Statement

Design and implement a Credit Card Application System where:
- Users can apply for a credit card
- Applications are validated against business rules
- Credit score is automatically evaluated
- Applications are approved/rejected
- Applicants can track application status anytime
- Admins can review and take action when required

---

## Tech Stack

### Frontend
- React.JS
- TailwindCSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- JWT (Admin authentication)

### Database
- MongoDB (NoSQL)

### Testing
- Jest

### DevOps
- GitHub Actions (CI/CD)
- Environment variables for secrets
- Cloud deployment (Vercel / Render / AWS)

---

## Personas & Roles

### 1. Applicant (Public User)
- Applies for a credit card
- Tracks application using Application Number
- No login required

### 2. Approver (Admin / Bank Ops)
- Views application queue
- Reviews flagged applications
- Approves or rejects applications
- Requires authentication

---

Applicant
	•	/apply – Apply for credit card
	•	/submitted – Submission confirmation
	•	/track – Enter application number
	•	/track/:applicationNumber – Status timeline

Admin
	•	/admin/login – Admin authentication
	•	/admin/dashboard – Application queue
	•	/admin/applications/:applicationNumber – Detailed review

API Endpoints

Public
	•	POST /api/applications – Submit application
	•	GET /api/applications/:applicationNumber – Track status

Admin
	•	POST /api/admin/login
	•	GET /api/admin/applications
	•	POST /api/admin/applications/:applicationNumber/approve
	•	POST /api/admin/applications/:applicationNumber/reject

Schemas

applications

{
  "Application": {
    "applicationNumber": "String (unique)",
    "status": "Enum",
    "creditScore": "Number",
    "creditLimit": "Number",
    "rejectionReason": "String | null",
    "createdAt": "Date",
    "updatedAt": "Date",

    "applicant": {
      "fullName": "String",
      "dob": "Date",
      "pan": "String",
      "annualIncome": "Number",
      "email": "String",
      "phone": "String"
    },

    "statusHistory": [
      {
        "status": "Enum",
        "changedAt": "Date",
        "changedBy": "ADMIN",
        "reason": "String"
      }
    ]
  }
}

admins

{
    "adminId": "String (unique)",
    "name": "String",
    "email": "String (unique)",
    "role": "APPROVER",
    "isActive": "Boolean",
    "createdAt": "Date",
    "updatedAt": "Date"
}

applicationStatus
{
    "SUBMITTED",
    "CHECK_IN_PROGRESS",
    "APPROVED",
    "REJECTED",
    "DISPATCHED"
}

rejectionReasons
{
  
    "AGE_NOT_ELIGIBLE",
    "DUPLICATE_APPLICATION",
    "LOW_CREDIT_SCORE",
    "ADMIN_REJECTION"
}


