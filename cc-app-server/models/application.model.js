const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: Number, required: true },
});

const professionSchema = new Schema({
    type: { type: String, enum: ['SALARIED', 'SELF_EMPLOYED'], required: true },
    company: { type: String, enum: ['NAME', 'NOT_APPLIED'], required: true },
});

const applicantSchema = new Schema({
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    pan: { type: String, required: true },
    annualIncome: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profession: { type: professionSchema, required: true },
    address: { type: addressSchema, required: true },
});

const statusHistorySchema = new Schema({
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], required: true },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, enum: ['APPROVER'], required: true },
    reason: { type: String },
});

const applicationSchema = new Schema(
    {
        applicationNumber: { type: String, unique: true, required: true },
        cardType: { type: String, enum: ['MASTER', 'VISA', 'RUPAY'], required: true },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], required: true },
        creditScore: { type: Number, required: true },
        creditLimit: { type: Number, required: true },
        rejectionReason: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        applicant: { type: applicantSchema, required: true },
        statusHistory: [statusHistorySchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);