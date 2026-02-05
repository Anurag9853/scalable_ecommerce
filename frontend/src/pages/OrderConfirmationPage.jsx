import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { formatISTDateTime, calculateDeliveryEstimate } from '../utils/dateUtils';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get('/orders/my');
        const found = data.find((o) => o._id === id);
        setOrder(found || null);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-container">Loading order...</div>;
  if (error) return <div className="page-container error">{error}</div>;
  if (!order) return <div className="page-container">Order not found.</div>;

  const eta = calculateDeliveryEstimate(order.createdAt);

  return (
    <div className="page-container">
      <h2>Order Confirmation</h2>
      <div className="card">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Placed on:</strong> {formatISTDateTime(order.createdAt)} IST
        </p>
        <p>
          <strong>Payment status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Delivery estimate:</strong> {eta}
        </p>
        <p>
          <strong>Total paid:</strong> ₹{order.totalAmount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

