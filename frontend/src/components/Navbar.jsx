import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useDebounce from '../hooks/useDebounce';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // keep URL in sync with debounced search term
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/products" className="navbar-brand">
          Scalable E-Commerce
        </Link>
      </div>
      <div className="navbar-center">
        <div className="navbar-search">
          <input
            type="search"
            placeholder="Search for products, categories, users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="link-button clear-search"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/products">Home</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user && (
          <Link to="/cart" className="cart-link">
            Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        )}
        {user && user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button type="button" onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

