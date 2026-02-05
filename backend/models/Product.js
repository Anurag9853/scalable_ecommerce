const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    // Maximum Retail Price (MRP) shown as striked price
    mrp: {
      type: Number,
      required: true,
      min: 0
    },
    // Selling price (before GST)
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 4.2,
      min: 1,
      max: 5
    },
    targetUser: {
      type: String,
      enum: ['CHILD', 'STUDENT', 'MEN', 'WOMEN', 'FAMILY'],
      default: 'FAMILY'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

