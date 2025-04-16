// models/CanteenOrder.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CanteenOrderSchema = new Schema({
    // The name of the food item (e.g., "Burger", "Sandwich").
    name: { type: Schema.Types.ObjectId, ref: 'fooditems', required: true },
    // The total quantity ordered for the item.
    quantity: { type: Number, required: true },
    // How many of the items have been prepared.
    prepared: { type: Number, default: 0 },
}, { timestamps: true });

export const CanteenOrder = mongoose.models.CanteenOrder || mongoose.model('CanteenOrder', CanteenOrderSchema);