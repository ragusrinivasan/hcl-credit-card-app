const mongoose = require('mongoose');

const { Schema } = mongoose;

const cardPinSchema = new Schema(
    {
        pinHash: {
            type: String,
            default: null,
        },
        pinStatus: {
            type: String,
            enum: ['NOT_SET', 'ACTIVE', 'BLOCKED'],
            default: 'NOT_SET',
        },
        pinType: {
            type: String,
            enum: ['DEFAULT', 'USER_DEFINED'],
            default: 'DEFAULT',
        },
        attemptsLeft: {
            type: Number,
            default: 3,
        },
    },
    { _id: false }
);

const creditCardSchema = new Schema(
    {
        cardId: {
            type: String,
            unique: true,
            required: true,
        },
        applicationNumber: {
            type: String,
            ref: 'Application',
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        cardType: {
            type: String,
            enum: ['VISA', 'MASTERCARD', 'RUPAY'],
            required: true,
        },
        creditLimit: {
            type: Number,
            required: true,
        },
        expiryMonth: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        expiryYear: {
            type: Number,
            required: true,
        },
        cvv: {
            type: String,
            required: true,
        },
        issuedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'BLOCKED', 'IN_ACTIVE'],
            default: 'ACTIVE',
        },
        pin: {
            type: cardPinSchema,
            default: () => ({}),
        },
    },
    { timestamps: true }
);

// Method to get masked card number (shows only last 4 digits)
creditCardSchema.methods.getMaskedCardNumber = function () {
    return 'XXXX-XXXX-XXXX-' + this.cardNumber.slice(-4);
};

// Transform when converting to JSON (hide sensitive data)
creditCardSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.cardNumber = 'XXXX-XXXX-XXXX-' + ret.cardNumber.slice(-4);
        delete ret.cvv;
        delete ret.pin.pinHash;
        return ret;
    },
});

module.exports = mongoose.model('CreditCard', creditCardSchema);