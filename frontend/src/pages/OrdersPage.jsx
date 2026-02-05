import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { formatISTDateTime } from '../utils/dateUtils';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders/my');
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page-container">Loading orders...</div>;
  if (error) return <div className="page-container error">{error}</div>;

  return (
    <div className="page-container">
      <h2>My Orders</h2>
      {orders.length === 0 && <p>You have no orders yet.</p>}
      {orders.map((order) => (
        <div key={order._id} className="card order-card">
          <div className="order-header">
            <span>Order ID: {order._id}</span>
            <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
            <span className={`status status-${order.paymentStatus?.toLowerCase() || 'pending'}`}>
              {order.paymentStatus || 'PENDING'}
            </span>
          </div>
          <p>
            <strong>Total:</strong> ₹{order.totalAmount.toLocaleString('en-IN')}
          </p>
          <p>
            <strong>Placed on:</strong> {formatISTDateTime(order.createdAt)} IST
          </p>
          <table className="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item) => (
                <tr key={item.productId._id || item.productId}>
                  <td>{item.productId.name || item.productId}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;

