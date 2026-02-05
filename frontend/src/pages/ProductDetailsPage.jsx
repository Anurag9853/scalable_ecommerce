import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiClient.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="page-container">Loading product...</div>;
  if (error) return <div className="page-container error">{error}</div>;
  if (!product) return <div className="page-container">Product not found</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>{product.name}</h2>
        <p className="muted">{product.category}</p>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
          {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
        </p>
        <button
          type="button"
          className="btn-primary"
          disabled={product.stock <= 0}
          onClick={() => addToCart(product, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

