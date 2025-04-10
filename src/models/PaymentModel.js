// models/Payment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'cash', 'mobile payment'],
        required: true
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paidAt: { type: Date }
}, { timestamps: true });

export const Payment = mongoose.models.payments || mongoose.model('payments', PaymentSchema);
