# hcl-credit-card-app
Repository for HCL hackathon credit card application




# Credit Card Application System (MERN-3)


Hackathon Project – 31 Jan 2026  
A full-stack Credit Card Application System built using the **MERN stack**.

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
- JWT (Approver authentication)

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

# API Endpoints

Public
	•	POST /api/applications – Submit application
	•	GET /api/applications/:applicationNumber – Track status

Admin
	•	POST /api/admin/login
	•	GET /api/admin/applications
	•	POST /api/admin/applications/:applicationNumber/approve
	•	POST /api/admin/applications/:applicationNumber/reject

# Schemas

# Applications

{
  "Application": {
    "applicationNumber": "String (unique)",
	"cardType": "MASTER | VISA | RUPAY",
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
      "phone": "String",
	  "profession": { 
	  "type": "SALARIED | SELF_EMPLOYED",
	  "company": "NAME | NOT_APPLIED",
	  }
	  "address": {
	  	 "line1":"String",
		 "line2":"String",
		 "city":"String",
		 "state":"String",
		 "pin": "Number"
	  	}
    },

    "statusHistory": [
      {
        "status": "Enum",
        "changedAt": "Date",
        "changedBy": "APPROVER",
        "reason": "String"
      }
    ]
  }
}

# Approvers

{
 "Approvers":{
    "adminId": "String (unique)",
    "name": "String",
    "email": "String (unique)",
    "role": "APPROVER",
    "isActive": "Boolean",
    "createdAt": "Date",
    "updatedAt": "Date"
	}
}

# Credit Cards 

{
  "CreditCard": {
    "cardId": "String (unique)",
    "applicationNumber": "String (reference)",
    "cardNumber": "String (masked when returned)",
    "cardType": "VISA | MASTERCARD | RUPAY",
    "creditLimit": "Number",
    "expiryMonth": "Number",
    "expiryYear": "Number",
    "cvv": "String (encrypted)",
    "issuedAt": "Date",
    "status": "ACTIVE | BLOCKED | IN_ACTIVE",
    "createdAt": "Date"
  }
}

# Credit Card PIN

{
  "CreditCardPIN": {
    "pinId": "String (unique)",
    "cardId": "String (reference to CreditCard)",
    "pinHash": "String (hashed + salted)",
    "pinStatus": "NOT_SET | ACTIVE | BLOCKED",
	"pinType": "DEFAULT | USER_DEFINED",
    "attemptsLeft": "Number",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}

# Application Status

{
"applicationStatus":{
    "SUBMITTED",
    "CHECK_IN_PROGRESS",
    "APPROVED",
    "REJECTED",
    "DISPATCHED"
	}
}

# Rejection Reasons
{
  "rejectionReasons":{
    "AGE_NOT_ELIGIBLE",
    "DUPLICATE_APPLICATION",
    "LOW_CREDIT_SCORE",
    "ADMIN_REJECTION"
	}
}


# User Stories



1. Nasurullah
 - Application form FE and BE
 - Confirmation Screen FE and BE
2. Boopathiraja
 - Application tracking FE and BE
 - Credit Card Activation FE and BE
3. Yaseen
 - Approver Action FE and BE
 - Approver Login FE and BE
 - frontend boiler-plate
4. Raguraam
 - Approver Dashboard FE and BE
 - Search and Filter FE and BE
 - backend boiler-plate


# middlewares

- authentication
- error handler
- cors
- helmet
- body parser
- logger
   
   
# Performance Optimization

### frontend
1. virutalization
2. pagination
3. debouncing
4. React compiler (memoization)
5. lazy loading
6. SEO friendly
7. React query

### backend
1. rate limiting 
2. indexing in db

# Security
1. Captcha
2. Authentication
3. Authorization
4. Route guards
5. hashing the passwords
6. encrypt API responses

# Best practices
1. Resuable components
2. Uniform theme
   
   
   
