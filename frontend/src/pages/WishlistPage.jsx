import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🤍</div>
          <h1 className="empty-state-title">Your wishlist is empty</h1>
          <p className="empty-state-text">
            Save your favourite products here and come back to buy them anytime.
          </p>
          <Link to="/products" className="btn btn-primary">Discover Products →</Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 className="section-heading">My Wishlist</h1>
          <p className="section-subheading">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => wishlistItems.forEach((p) => addToCart(p, 1))}
        >
          🛒 Add All to Cart
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
