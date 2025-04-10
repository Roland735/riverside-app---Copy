// models/Order.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        foodItem: { type: Schema.Types.ObjectId, ref: 'foodItems', required: true },
        quantity: { type: Number, default: 1 }
    }],
    collectionId: { type: String, required: true },
    orderId: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = mongoose.models.orders || mongoose.model('orders', OrderSchema);
