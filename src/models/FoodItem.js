// models/FoodItem.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const FoodItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: String } // URL to an image of the food item.
}, { timestamps: true });

export const foodItem = mongoose.models.foodItems || mongoose.model('foodItems', FoodItemSchema);
