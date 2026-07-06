import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { formatISTDateTime } from '../utils/dateUtils';

const STATUS_STEPS = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];

const StatusTimeline = ({ currentStatus }) => {
  const idx = STATUS_STEPS.indexOf(currentStatus);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 'var(--space-4)' }}>
      {STATUS_STEPS.map((step, i) => {
        const done   = i <= idx;
        const active = i === idx;
        return (
          <React.Fragment key={step}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto var(--space-2)',
                background: done ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                border: active ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: done ? 'white' : 'var(--color-text-tertiary)',
                transition: 'all 0.4s ease',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)', fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              }}>
                {step}
              </div>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 2, height: 2,
                background: i < idx ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'background 0.4s ease',
                marginBottom: 20,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders/my');
        setOrders(data);
      } catch {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>My Orders</h1>
        <div className="orders-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="order-card">
              <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 10, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, width: '30%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h1 className="empty-state-title">No orders yet</h1>
          <p className="empty-state-text">When you place your first order, it will appear here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 className="section-heading">My Orders</h1>
          <p className="section-subheading">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            {/* Header */}
            <div className="order-card-header">
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
                  ORDER ID
                </div>
                <div className="order-id" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  #{order._id.slice(-8).toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>PLACED ON</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                  {formatISTDateTime(order.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status === 'DELIVERED' ? '✓ ' : order.status === 'SHIPPED' ? '🚚 ' : ''}
                  {order.status}
                </span>
                <span className={`status-badge ${order.paymentStatus?.toLowerCase() || 'created'}`}>
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="order-card-body">
              {/* Status timeline (skip if cancelled) */}
              {order.status !== 'CANCELLED' && (
                <StatusTimeline currentStatus={order.status} />
              )}
              {order.status === 'CANCELLED' && (
                <div className="alert alert-error" style={{ marginTop: 'var(--space-4)' }}>
                  This order was cancelled.
                </div>
              )}

              {/* Products */}
              <div className="order-items-summary" style={{ marginTop: 'var(--space-5)' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-2)' }}>
                  Items Ordered
                </div>
                {order.products.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <span>
                      {item.productId?.name || 'Product'} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="order-card-footer">
              <div>
                <div className="order-total-label">Order Total (incl. GST)</div>
                <div className="order-total-amount">₹{order.totalAmount.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {order.status === 'DELIVERED' && (
                  <button className="btn btn-outline btn-sm">Write a Review</button>
                )}
                <button className="btn btn-secondary btn-sm">Download Invoice</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
