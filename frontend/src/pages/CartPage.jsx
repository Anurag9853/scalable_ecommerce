import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../components/ProductCard';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [coupon, setCoupon]     = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const gstAmount   = Math.round(totalAmount * 0.18);
  const discount    = couponApplied ? Math.round(totalAmount * 0.1) : 0;
  const finalAmount = totalAmount + gstAmount - discount;

  // Load Razorpay script once
  useEffect(() => {
    if (document.getElementById('razorpay-sdk')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === 'WELCOME500') {
      setCouponApplied(true);
    } else {
      setError('Invalid coupon code.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const { data: orderData } = await apiClient.post('/payments/create-order', {
        amount: finalAmount,
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BharatMart',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await apiClient.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              products: items.map((item) => ({
                productId: item.productId,
                quantity:  item.quantity,
              })),
            });
            clearCart();
            navigate(`/order-confirmation/${verifyRes.data.order._id}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {},
        theme: { color: '#0071e3' },
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

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: 800 }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h1 className="empty-state-title">Your cart is empty</h1>
          <p className="empty-state-text">
            Looks like you haven't added anything to your cart yet. Start shopping!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">Explore Products →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>
        Shopping Cart <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>
      </h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>
      )}

      <div className="cart-layout">
        {/* ── Cart Items ──────────────────────────────── */}
        <div className="cart-items-list">
          {items.map((item) => {
            // Build a pseudo-product for image generation
            const pseudoProduct = { _id: item.productId, category: item.category };
            const imgSrc = getProductImage(pseudoProduct);

            return (
              <div key={item.productId} className="cart-item-card">
                {/* Image */}
                <img
                  className="cart-item-img"
                  src={imgSrc}
                  alt={item.name}
                  onError={(e) => { e.target.src = 'https://picsum.photos/100/100?grayscale'; }}
                />

                {/* Info */}
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-brand">₹{item.price.toLocaleString('en-IN')} per unit</div>

                  <div className="cart-item-controls">
                    {/* Quantity control */}
                    <div className="cart-qty-control">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >−</button>
                      <div className="cart-qty-display">{item.quantity}</div>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >+</button>
                    </div>

                    {/* Remove */}
                    <button
                      className="btn btn-sm"
                      style={{ background: 'none', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: 'var(--font-size-xs)', cursor: 'pointer' }}
                      onClick={() => removeFromCart(item.productId)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="cart-item-price-col">
                  <div className="cart-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              </div>
            );
          })}

          {/* Continue shopping */}
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)',
            fontWeight: 500, padding: 'var(--space-3) 0',
          }}>
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary ───────────────────────────── */}
        <div className="order-summary-card">
          <h2 className="order-summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({items.length} items)</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span style={{ color: 'var(--color-success)' }}>
              {totalAmount >= 499 ? 'FREE' : '₹49'}
            </span>
          </div>
          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          {couponApplied && (
            <div className="summary-row" style={{ color: 'var(--color-success)' }}>
              <span>Coupon (WELCOME500)</span>
              <span>−₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Coupon */}
          {!couponApplied && (
            <div className="coupon-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn btn-outline btn-sm" onClick={handleCoupon}>Apply</button>
            </div>
          )}

          {couponApplied && (
            <div style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-success-bg)', color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)',
              fontWeight: 500, marginBottom: 'var(--space-3)',
            }}>✅ Coupon WELCOME500 applied — 10% off!</div>
          )}

          <div className="summary-row total">
            <span>Total Payable</span>
            <span>₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>

          {totalAmount < 499 && (
            <div style={{
              fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)',
              background: 'var(--color-warning-bg)', padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-3)',
            }}>
              Add ₹{(499 - totalAmount).toLocaleString('en-IN')} more for FREE delivery!
            </div>
          )}

          <button
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: 'var(--space-5)', justifyContent: 'center' }}
            disabled={loading || items.length === 0}
            onClick={handleCheckout}
          >
            {loading ? '⏳ Processing...' : '🔒 Proceed to Pay — ₹' + finalAmount.toLocaleString('en-IN')}
          </button>

          <div style={{
            marginTop: 'var(--space-4)', textAlign: 'center',
            fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)',
          }}>
            🔒 Secured by Razorpay &nbsp;·&nbsp; UPI &nbsp;·&nbsp; Cards &nbsp;·&nbsp; NetBanking
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
