import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const gstAmount = Math.round(totalAmount * 0.18);
  const finalAmount = totalAmount + gstAmount;

  useEffect(() => {
    // Load Razorpay checkout script once
    if (document.getElementById('razorpay-sdk')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      // 1. Create Razorpay order
      const { data: orderData } = await apiClient.post('/payments/create-order', {
        amount: finalAmount
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Bharat Mart',
        description: 'Order payment',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await apiClient.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              products: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity
              }))
            });
            clearCart();
            navigate(`/order-confirmation/${verifyRes.data.order._id}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {},
        theme: {
          color: '#1d4ed8'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Your Cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {error && <div className="error">{error}</div>}
      {items.length > 0 && (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>₹{item.price.toLocaleString('en-IN')}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, e.target.value)}
                    />
                  </td>
                  <td>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <p>
              <strong>Subtotal:</strong> ₹{totalAmount.toLocaleString('en-IN')}
            </p>
            <p>
              <strong>GST (18%):</strong> ₹{gstAmount.toLocaleString('en-IN')}
            </p>
            <p>
              <strong>Total Payable:</strong> ₹{finalAmount.toLocaleString('en-IN')}
            </p>
            <button
              type="button"
              className="btn-primary"
              disabled={loading || items.length === 0}
              onClick={handleCheckout}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

