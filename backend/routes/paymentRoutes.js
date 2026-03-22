const express = require('express');
const crypto = require('crypto');
const getRazorpayInstance = require('../config/razorpay');
const { protect } = require('../middleware/authMiddleware');
const { createOrder: createDomainOrder } = require('../services/orderService');

const router = express.Router();

// Create a Razorpay order for the given amount (in INR)
router.post('/create-order', protect, async (req, res) => {
  try {
    // 🔥 ADD HERE
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `order_rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// Verify Razorpay payment signature and create application order
router.post('/verify', protect, async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Payment verification data is incomplete');
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment verification failed');
    }

    // Reuse existing validation pipeline by mimicking a request object
    const fakeReq = {
      body: { products },
      user: req.user
    };

    const order = await createDomainOrder(fakeReq, {
      paymentStatus: 'PAID',
      paymentInfo: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      }
    });

    return res.status(201).json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

