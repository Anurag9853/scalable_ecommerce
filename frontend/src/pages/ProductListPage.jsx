import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get('/products', {
          params: {
            search: search || undefined,
            category: category || undefined,
            sort: sort || undefined
          }
        });
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Products</h2>
        <div className="grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="card product-card skeleton-card" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="page-container error">{error}</div>;

  return (
    <div className="page-container">
      <h2>Products</h2>
      <div className="grid">
        {products.length === 0 && <p>No products found. Try a different search or filter.</p>}
        {products.map((product) => {
          const discount = product.pricing?.discountPercentage ?? 0;
          const pricing = product.pricing ?? {
            mrp: product.mrp,
            price: product.price,
            gstAmount: Math.round(product.price * 0.18),
            finalPayableAmount: product.price + Math.round(product.price * 0.18)
          };

          const stockLabel =
            product.stock === 0
              ? 'Out of stock'
              : product.stock <= 3
              ? `Only ${product.stock} left!`
              : `In stock: ${product.stock}`;

          return (
            <div key={product._id} className="card product-card hover-card">
              <h3>{product.name}</h3>
              <p className="muted">
                {product.category} · For {product.targetUser?.toLowerCase() || 'family'}
              </p>
              <p>{product.description}</p>
              <p className="rating-line">⭐ {product.rating?.toFixed(1) || '4.2'} / 5</p>
              <p className="price">
                <span className="mrp">₹{pricing.mrp?.toLocaleString('en-IN')}</span>{' '}
                <span className="selling">₹{pricing.price?.toLocaleString('en-IN')}</span>{' '}
                {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
              </p>
              <p className="gst-line">
                GST (18%): ₹{pricing.gstAmount?.toLocaleString('en-IN')} · Total:{' '}
                <strong>₹{pricing.finalPayableAmount?.toLocaleString('en-IN')}</strong>
              </p>
              <p className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>{stockLabel}</p>
              <div className="card-actions">
                <Link to={`/products/${product._id}`} className="btn-secondary">
                  View Details
                </Link>
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
        })}
      </div>
    </div>
  );
};

export default ProductListPage;

