import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImage } from '../utils/productImages';

// Re-export so other files can import from here (backward compat)
export { getProductImage };

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

  const imgSrc   = getProductImage(product, 0);
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
              // Fallback to a generic product image on network error
              e.target.src =
                'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=480&h=480&fit=crop&q=80';
              e.target.onerror = null;
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
