// Assuming you have Mongoose installed, include it
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Item schema
const itemSchema = new Schema({
    name: String,
    quantity: Number,
    lastStockChange: Date
});

// Define the Inventory schema which will have an array of items
const inventorySchema = new Schema({
    items: [itemSchema]
});

// Define the Hospital schema which will have inventory
const hospitalSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    inventory: inventorySchema
});

// Create models for Hospital and Item
const Hospital = mongoose.model('Hospitalinv', hospitalSchema);
const Item = mongoose.model('Item', itemSchema);

module.exports = { Hospital, Item };
