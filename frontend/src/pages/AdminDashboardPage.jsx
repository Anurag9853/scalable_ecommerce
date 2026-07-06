import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { formatISTDateTime } from '../utils/dateUtils';

const MetricCard = ({ icon, label, value, gradient }) => (
  <div className="metric-card">
    <div className="metric-icon" style={{ background: gradient }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
    </div>
    <div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [orders, setOrders]   = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [metrics, setMetrics] = useState({ revenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, lowStockRes, metricsRes] = await Promise.all([
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/products/low-stock'),
        apiClient.get('/admin/metrics'),
      ]);
      setOrders(ordersRes.data);
      setLowStock(lowStockRes.data);
      setMetrics(metricsRes.data);
    } catch {
      setError('Failed to load admin data. Check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
      await loadData();
    } catch {
      setError('Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="section-heading">Admin Dashboard</h1>
        <div className="admin-metrics-grid" style={{ marginBottom: 'var(--space-8)' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="metric-card">
              <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 12 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 4 }} />
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

  const STATUSES = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 className="section-heading">Admin Dashboard</h1>
          <p className="section-subheading">Manage orders, inventory, and business metrics</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="admin-metrics-grid">
        <MetricCard icon="💰" label="Total Revenue" value={`₹${metrics.revenue.toLocaleString('en-IN')}`} gradient="linear-gradient(135deg, #667eea, #764ba2)" />
        <MetricCard icon="📦" label="Total Orders" value={metrics.totalOrders} gradient="linear-gradient(135deg, #f093fb, #f5576c)" />
        <MetricCard icon="⚠️" label="Low Stock Items" value={lowStock.length} gradient="linear-gradient(135deg, #ffecd2, #fcb69f)" />
        <MetricCard icon="✅" label="Fulfilled Orders" value={orders.filter((o) => o.status === 'DELIVERED').length} gradient="linear-gradient(135deg, #a8edea, #fed6e3)" />
      </div>

      {/* Tabs */}
      <div className="product-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`product-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 All Orders ({orders.length})
        </button>
        <button className={`product-tab ${activeTab === 'lowstock' ? 'active' : ''}`} onClick={() => setActiveTab('lowstock')}>
          ⚠️ Low Stock {lowStock.length > 0 && `(${lowStock.length})`}
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
              <div className="empty-state-icon">📭</div>
              <h2 className="empty-state-title">No orders yet</h2>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.user?.name || 'N/A'}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {formatISTDateTime(order.createdAt)}
                      </td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="status-actions">
                          {STATUSES.map((status) => (
                            <button
                              key={status}
                              className={`status-action-btn ${order.status === status ? 'active' : ''}`}
                              disabled={updating}
                              onClick={() => handleStatusChange(order._id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Low Stock Table */}
      {activeTab === 'lowstock' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {lowStock.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
              <div className="empty-state-icon">🎉</div>
              <h2 className="empty-state-title">No low-stock products!</h2>
              <p className="empty-state-text">All products are well-stocked.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stock Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{p.category}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.stock === 0 ? 'cancelled' : 'shipped'}`}>
                        {p.stock === 0 ? '✕ Out of Stock' : '⚠ Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
