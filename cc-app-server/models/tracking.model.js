const mongoose = require('mongoose');

const { Schema } = mongoose;

const statusHistorySchema = new Schema({
    status: { type: String, enum: ['SUBMITTED', 'CHECK_IN_PROGRESS', 'APPROVED', 'REJECTED', 'DISPATCHED'], required: true },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, enum: ['APPROVER'], required: true },
    reason: { type: String },
});

module.exports = mongoose.model('Applicationd', statusHistorySchema, 'application');
