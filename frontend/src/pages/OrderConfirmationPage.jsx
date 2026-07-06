import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { formatISTDateTime, calculateDeliveryEstimate } from '../utils/dateUtils';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get('/orders/my');
        const found = data.find((o) => o._id === id);
        setOrder(found || null);
      } catch {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  if (!order) return (
    <div className="page-container">
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h2 className="empty-state-title">Order not found</h2>
        <Link to="/orders" className="btn btn-primary">My Orders</Link>
      </div>
    </div>
  );

  const eta = calculateDeliveryEstimate(order.createdAt);

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      {/* Success hero */}
      <div className="order-confirm-hero">
        <div className="order-confirm-check">✓</div>
        <h1 className="order-confirm-title">Order Confirmed! 🎉</h1>
        <p className="order-confirm-subtitle">
          Thank you for shopping with BharatMart. Your order has been placed successfully.
        </p>
      </div>

      {/* Order card */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        {/* Order ID */}
        <div style={{
          textAlign: 'center', marginBottom: 'var(--space-5)',
          padding: 'var(--space-4)', background: 'var(--color-overlay)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
            ORDER ID
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--font-size-lg)', letterSpacing: 1 }}>
            #{order._id.slice(-12).toUpperCase()}
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {[
            ['📅 Placed On',       formatISTDateTime(order.createdAt)],
            ['💳 Payment',         order.paymentStatus || 'PENDING'],
            ['📦 Order Status',    order.status],
            ['🚚 Estimated Delivery', eta],
          ].map(([label, val]) => (
            <div key={label} style={{ padding: 'var(--space-3)', background: 'var(--color-overlay)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
            ITEMS ORDERED
          </div>
          {order.products.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: 'var(--space-3) 0',
              borderBottom: '1px solid var(--color-border-light)',
              fontSize: 'var(--font-size-sm)',
            }}>
              <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--space-4)', background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Total Paid</span>
          <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            📦 Track Orders
          </Link>
          <Link to="/" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>

      {/* Email confirmation note */}
      <p style={{
        textAlign: 'center', marginTop: 'var(--space-5)',
        fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', lineHeight: 1.5,
      }}>
        A confirmation email has been sent to your registered email address.
        <br />Contact us at{' '}
        <a href="mailto:support@bharatmart.in" style={{ color: 'var(--color-primary)' }}>
          support@bharatmart.in
        </a>{' '}if you have any questions.
      </p>
    </div>
  );
};

export default OrderConfirmationPage;
