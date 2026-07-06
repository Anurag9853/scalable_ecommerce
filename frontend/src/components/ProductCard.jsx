import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * Get a deterministic product image based on category + id.
 * Uses picsum.photos which is reliable and free.
 */
const CATEGORY_SEEDS = {
  'Electronics':              'tech-electronics',
  'Kitchen & Home':           'kitchen-modern',
  'Student Essentials':       'student-study',
  'Kids & Baby':              'baby-kids',
  'Men':                      'men-fashion',
  'Women':                    'women-fashion',
  'Office & Study':           'office-desk',
  'Health & Personal Care':   'health-wellness',
  'Smartphones':              'smartphone-device',
  'Laptops':                  'laptop-computer',
  'Headphones':               'headphone-audio',
  'Smart Watches':            'smartwatch-wearable',
  'Cameras':                  'camera-photography',
  'Gaming':                   'gaming-console',
  'Accessories':              'accessories-tech',
  'Monitors':                 'monitor-display',
  'Tablets':                  'tablet-device',
};

export const getProductImage = (product, index = 0) => {
  // Use a 6-character slice of product._id as numeric seed so picsum stays stable
  const idSlice = product._id ? product._id.slice(-6) : 'abc123';
  const numericSeed = parseInt(idSlice, 16) % 1000;
  const offset = numericSeed + index * 17;
  return `https://picsum.photos/seed/${offset + 200}/400/400`;
};

export const getStarString = (rating) => {
  const r = Math.round(rating * 2) / 2;
  return '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));
};

/* ── ProductCard ─────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const discount = product.pricing?.discountPercentage ?? 0;
  const pricing = product.pricing ?? {
    mrp: product.mrp,
    price: product.price,
    gstAmount: Math.round((product.price || 0) * 0.18),
    finalPayableAmount: (product.price || 0) + Math.round((product.price || 0) * 0.18),
  };

  const stockLabel =
    product.stock === 0
      ? 'Out of Stock'
      : product.stock <= 3
      ? `Only ${product.stock} left!`
      : 'In Stock';

  const stockClass =
    product.stock === 0 ? 'stock-out' : product.stock <= 3 ? 'stock-low' : 'stock-ok';

  const imgSrc = getProductImage(product);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        {/* Image */}
        <div className="product-card-img-wrap">
          <img
            className="product-card-img"
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${Math.floor(Math.random() * 900)}/400/400`;
            }}
          />

          {/* Discount badge */}
          {discount > 0 && (
            <span className="product-card-badge">{discount}% OFF</span>
          )}

          {/* Wishlist button */}
          <button
            className={`product-card-wishlist ${wishlisted ? 'wishlisted' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Body */}
        <div className="product-card-body">
          <div className="product-card-brand">{product.category}</div>
          <div className="product-card-name">{product.name}</div>

          {/* Rating */}
          <div className="product-card-rating">
            <span className="stars" style={{ color: '#ff9500', fontSize: 12 }}>
              {'★'.repeat(Math.round(product.rating || 4))}
              {'☆'.repeat(5 - Math.round(product.rating || 4))}
            </span>
            <span className="rating-count">{(product.rating || 4.2).toFixed(1)}</span>
          </div>

          {/* Price */}
          <div className="product-card-price">
            <div className="price-row">
              <span className="price-current">₹{pricing.price?.toLocaleString('en-IN')}</span>
              {pricing.mrp > pricing.price && (
                <span className="price-mrp">₹{pricing.mrp?.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="price-discount">{discount}% off</span>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className={`product-card-stock ${stockClass}`}>
            {product.stock === 0 ? '✕ ' : product.stock <= 3 ? '⚠ ' : '✓ '}
            {stockLabel}
          </div>

          {/* Actions */}
          <div className="product-card-actions">
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 ? 'Sold Out' : '+ Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
