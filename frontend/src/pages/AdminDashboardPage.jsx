import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { formatISTDateTime } from '../utils/dateUtils';

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [metrics, setMetrics] = useState({ revenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, lowStockRes, metricsRes] = await Promise.all([
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/products/low-stock'),
        apiClient.get('/admin/metrics')
      ]);
      setOrders(ordersRes.data);
      setLowStock(lowStockRes.data);
      setMetrics(metricsRes.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
      await loadData();
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="page-container">Loading admin dashboard...</div>;
  if (error) return <div className="page-container error">{error}</div>;

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>

      <section className="admin-section">
        <div className="grid">
          <div className="card">
            <h3>Total Revenue</h3>
            <p className="price">₹{metrics.revenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p className="price">{metrics.totalOrders}</p>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h3>All Orders</h3>
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => (
          <div key={order._id} className="card order-card">
            <div className="order-header">
              <span>Order ID: {order._id}</span>
              <span>User: {order.user?.email}</span>
              <span className={`status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount.toLocaleString('en-IN')}
            </p>
            <p>
              <strong>Placed:</strong> {formatISTDateTime(order.createdAt)} IST
            </p>
            <div className="status-actions">
              {['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    order.status === status ? 'btn-secondary btn-small' : 'btn-outline btn-small'
                  }
                  disabled={updating}
                  onClick={() => handleStatusChange(order._id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h3>Low Stock Products</h3>
        {lowStock.length === 0 && <p>No low-stock products 🎉</p>}
        {lowStock.length > 0 && (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;

