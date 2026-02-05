const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    // Selling price (before GST) captured at time of order
    price: {
      type: Number,
      required: true,
      min: 0
    },
    // GST amount for this line item
    gstAmount: {
      type: Number,
      required: true,
      min: 0
    },
    // Final payable for this line (price + GST)
    finalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [orderItemSchema],
    // Grand total including GST
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    // Delivery status
    status: {
      type: String,
      enum: ['CREATED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'CREATED'
    },
    // Payment lifecycle separate from delivery status
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING'
    },
    paymentInfo: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

