import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProductImage, getProductGallery } from '../utils/productImages';
import ProductSlider from '../components/ProductSlider';

/* ── Delivery estimate helper ─────────────────────────────── */
const getDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

/* ── ProductDetailsPage ───────────────────────────────────── */
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct]       = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeImg, setActiveImg]   = useState(0);
  const [quantity, setQuantity]     = useState(1);
  const [activeTab, setActiveTab]   = useState('description');
  const [addedMsg, setAddedMsg]     = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get(`/products/${id}`);
        setProduct(data);
        setActiveImg(0);
        // Fetch related products (same category)
        const { data: all } = await apiClient.get('/products');
        setRelated(all.filter((p) => p.category === data.category && p._id !== data._id).slice(0, 8));
      } catch {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ maxWidth: 1200 }}>
        <div className="product-details-layout">
          {/* Image skeleton */}
          <div>
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {[0,1,2,3].map((i) => (
                <div key={i} className="skeleton" style={{ width: 72, height: 72, borderRadius: 12 }} />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div style={{ paddingTop: 16 }}>
            {[150, 280, 220, 60, 120, 80, 200].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: i === 2 ? 36 : 14, width: w, marginBottom: 16, borderRadius: 6 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
    </div>
  );
  if (!product) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h2 className="empty-state-title">Product not found</h2>
      <Link to="/products" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const discount = product.pricing?.discountPercentage ?? 0;
  const pricing = product.pricing ?? {
    mrp: product.mrp,
    price: product.price,
    gstAmount: Math.round((product.price || 0) * 0.18),
    finalPayableAmount: (product.price || 0) + Math.round((product.price || 0) * 0.18),
  };

  // Generate 4 product image variants using curated keyword-matched Unsplash photos
  const images = getProductGallery(product);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    if (!user) {
      addToCart(product, quantity);
      return;
    }
    addToCart(product, quantity);
    setAddedMsg('✅ Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      addToCart(product, quantity);
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const stockLabel =
    product.stock === 0     ? 'Out of Stock'
    : product.stock <= 3   ? `Only ${product.stock} left in stock!`
    : `In Stock (${product.stock} available)`;

  const stockClass =
    product.stock === 0 ? 'stock-out' : product.stock <= 3 ? 'stock-low' : 'stock-ok';

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
        <Link to="/" style={{ color: 'var(--color-text-tertiary)' }}>Home</Link>
        {' '}/{' '}
        <Link to="/products" style={{ color: 'var(--color-text-tertiary)' }}>Products</Link>
        {' '}/{' '}
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--color-text-tertiary)' }}>{product.category}</Link>
        {' '}/{' '}
        <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
      </nav>

      <div className="product-details-layout">
        {/* ── Image Gallery ─────────────────────────── */}
        <div className="product-gallery">
          {/* Main image */}
          <div className="product-main-img-wrap">
            <img
              className="product-main-img"
              src={images[activeImg]}
              alt={product.name}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=480&h=480&fit=crop&q=80'; e.target.onerror = null; }}
            />
            {discount > 0 && (
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: 'var(--color-danger)', color: 'white',
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                fontWeight: 700, fontSize: 13,
              }}>{discount}% OFF</div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="product-thumbnails">
            {images.map((src, i) => (
              <div
                key={i}
                className={`product-thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={src} alt={`View ${i + 1}`} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=72&h=72&fit=crop&q=70'; e.target.onerror = null; }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Product Info ───────────────────────────── */}
        <div className="product-info-wrap">
          <div className="product-info-category">{product.category}</div>
          <h1 className="product-info-title">{product.name}</h1>

          {/* Rating */}
          <div className="product-info-rating">
            <span style={{ color: '#ff9500', fontSize: 18 }}>
              {'★'.repeat(Math.round(product.rating || 4))}
              {'☆'.repeat(5 - Math.round(product.rating || 4))}
            </span>
            <span style={{ fontWeight: 600 }}>{(product.rating || 4.2).toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              (127 reviews)
            </span>
          </div>

          {/* Price */}
          <div className="product-info-price">
            <div className="product-price-current">₹{pricing.price?.toLocaleString('en-IN')}</div>
            <div className="product-price-row">
              {pricing.mrp > pricing.price && (
                <span className="price-mrp">MRP ₹{pricing.mrp?.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="price-discount">{discount}% off</span>
              )}
            </div>
            <div className="product-price-gst">
              Incl. of all taxes &nbsp;·&nbsp; GST: ₹{pricing.gstAmount?.toLocaleString('en-IN')}
              &nbsp;·&nbsp; <strong>Total payable: ₹{pricing.finalPayableAmount?.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Stock */}
          <div className={`${stockClass} font-semibold`} style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--font-size-sm)' }}>
            {product.stock > 0 ? '✓ ' : '✕ '}{stockLabel}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="product-quantity-wrap">
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginRight: 4 }}>Qty:</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >−</button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >+</button>
            </div>
          )}

          {/* CTA */}
          {addedMsg && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--space-3)' }}>{addedMsg}</div>
          )}
          <div className="product-action-group">
            <button
              className="btn btn-primary btn-lg"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-secondary btn-lg"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
              style={{ flex: 1 }}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Wishlist */}
          <button
            className={`btn ${wishlisted ? 'btn-danger' : 'btn-outline'} w-full`}
            style={{ marginBottom: 'var(--space-5)' }}
            onClick={() => toggleWishlist(product)}
          >
            {wishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
          </button>

          {/* Delivery info */}
          <div className="delivery-info-card">
            <div className="delivery-info-row">
              <span className="delivery-icon">🚚</span>
              <span><strong>Free Delivery</strong> by {getDeliveryDate()} on orders above ₹499</span>
            </div>
            <div className="delivery-info-row">
              <span className="delivery-icon">🔄</span>
              <span><strong>Easy Returns</strong> — 30-day hassle-free return policy</span>
            </div>
            <div className="delivery-info-row">
              <span className="delivery-icon">🛡️</span>
              <span><strong>1 Year Warranty</strong> — Covered by BharatMart Assurance</span>
            </div>
            <div className="delivery-info-row">
              <span className="delivery-icon">🔒</span>
              <span><strong>Secure Payment</strong> — Razorpay, UPI, Cards, NetBanking</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specs / Reviews ────────── */}
      <div>
        <div className="product-tabs">
          {['description', 'specs', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`product-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ padding: 'var(--space-4) 0' }}>
          {activeTab === 'description' && (
            <div>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: 720 }}>
                {product.description}
              </p>
              <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                {['Genuine Product', 'Quality Assured', 'BIS Certified', 'ISI Mark'].map((tag) => (
                  <span key={tag} style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                    fontSize: 'var(--font-size-xs)', fontWeight: 500,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
              {[
                ['Category', product.category],
                ['Target Audience', product.targetUser || 'Family'],
                ['Rating', `${(product.rating || 4.2).toFixed(1)} / 5`],
                ['Stock Available', product.stock],
                ['MRP', `₹${product.mrp?.toLocaleString('en-IN')}`],
                ['Selling Price', `₹${pricing.price?.toLocaleString('en-IN')}`],
                ['GST (18%)', `₹${pricing.gstAmount?.toLocaleString('en-IN')}`],
                ['Total Payable', `₹${pricing.finalPayableAmount?.toLocaleString('en-IN')}`],
              ].map(([key, val]) => (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-overlay)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{key}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{(product.rating || 4.2).toFixed(1)}</div>
                  <div style={{ color: '#ff9500', fontSize: 24 }}>{'★'.repeat(Math.round(product.rating || 4))}</div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>127 reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((r) => {
                    const pct = r === Math.round(product.rating || 4) ? 65 : r > Math.round(product.rating || 4) ? 20 : 15;
                    return (
                      <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, width: 16, textAlign: 'right', color: 'var(--color-text-secondary)' }}>{r}</span>
                        <span style={{ color: '#ff9500', fontSize: 12 }}>★</span>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-bg-tertiary)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#ff9500', borderRadius: 3, transition: 'width 0.6s ease' }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 30 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample reviews */}
              {[
                { name: 'Rahul S.', rating: 5, comment: 'Excellent product! Exactly as described. Delivery was super fast. Highly recommend.' },
                { name: 'Priya M.', rating: 4, comment: 'Good quality. Value for money. Packaging was good. Will buy again.' },
                { name: 'Amit K.', rating: 5, comment: 'Great product at this price point. Very happy with my purchase from BharatMart.' },
              ].map((review, i) => (
                <div key={i} style={{
                  padding: 'var(--space-4)', marginBottom: 'var(--space-3)',
                  background: 'var(--color-overlay)', borderRadius: 'var(--radius-lg)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{review.name}</div>
                    <span style={{ color: '#ff9500' }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ───────────────────────────── */}
      {related.length > 0 && (
        <div style={{ marginTop: 'var(--space-12)' }}>
          <ProductSlider
            title="Similar Products"
            subtitle={`More from ${product.category}`}
            products={related}
            loading={false}
            seeAllLink={`/products?category=${encodeURIComponent(product.category)}`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
