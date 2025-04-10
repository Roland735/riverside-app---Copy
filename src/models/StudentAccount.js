// models/StudentAccount.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    type: {
        type: String,
        enum: ['purchase', 'withdrawal', 'deposit'],
        required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const StudentAccountSchema = new Schema(
    {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        balance: { type: Number, default: 0 },
        transactions: [TransactionSchema],
    },
    { timestamps: true }
);

export const StudentAccount =
    mongoose.models.StudentAccount ||
    mongoose.model('StudentAccount', StudentAccountSchema);
