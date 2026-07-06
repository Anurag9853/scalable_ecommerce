import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import useDebounce from '../hooks/useDebounce';

/* ── Minimal SVG Icons ─────────────────────────────────── */
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconHeart   = ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconCart    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconUser    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconSun     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconMoon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconChevron = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

/* ── Dark mode hook ─────────────────────────────────────── */
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Watch system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return; // user overrode, don't track
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return [isDark, setIsDark];
};

/* ── Popular searches hint ──────────────────────────────── */
const POPULAR_SEARCHES = [
  { icon: '📱', label: 'Smartphones' },
  { icon: '💻', label: 'Laptops' },
  { icon: '🎧', label: 'Headphones' },
  { icon: '⌚', label: 'Smart Watches' },
  { icon: '🎮', label: 'Gaming' },
];

/* ── Navbar ─────────────────────────────────────────────── */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDark, setIsDark] = useDarkMode();
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Scroll detection for glass blur
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync search input state with URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams, location.pathname]);

  // Sync search → URL (navigate to /products if typing elsewhere)
  useEffect(() => {
    if (location.pathname !== '/products') {
      if (debouncedSearch) {
        navigate(`/products?search=${encodeURIComponent(debouncedSearch)}`);
      }
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, location.pathname, navigate, searchParams, setSearchParams]);


  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePopularSearch = (label) => {
    setSearchTerm(label);
    setSearchFocused(false);
    navigate(`/products?search=${encodeURIComponent(label)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand">BharatMart</Link>

          {/* Search */}
          <div className="navbar-search-wrap" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <span className="navbar-search-icon">
                <IconSearch />
              </span>
              <input
                type="search"
                className="navbar-search"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={() => { setSearchTerm(''); searchRef.current?.querySelector('input')?.focus(); }}
                >
                  ✕
                </button>
              )}
            </form>

            {/* Dropdown */}
            {searchFocused && (
              <div className="search-dropdown">
                <div className="search-dropdown-section">
                  <div className="search-dropdown-label">Popular</div>
                  {POPULAR_SEARCHES.map((s) => (
                    <button
                      key={s.label}
                      className="search-suggestion-item"
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                      onMouseDown={() => handlePopularSearch(s.label)}
                    >
                      <span className="search-suggestion-icon">{s.icon}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop nav links */}
          <div className="navbar-links">
            <Link to="/products" className="nav-link">Shop</Link>
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}

            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <IconSun /> : <IconMoon />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <IconHeart filled={wishlistCount > 0} />
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            {user ? (
              <Link to="/cart" className="nav-icon-btn" title="Cart">
                <IconCart />
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </Link>
            ) : null}

            {/* Auth */}
            {!user ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Link to="/orders" className="nav-link">Orders</Link>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  title={`Logged in as ${user.name}`}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

          {/* Mobile: icons + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }} className="mobile-icons">
            <button
              className="theme-toggle mobile-only"
              onClick={() => setIsDark((d) => !d)}
              style={{ border: 'none', background: 'none', padding: 'var(--space-2)' }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <IconSun /> : <IconMoon />}
            </button>
            <Link to="/wishlist" className="nav-icon-btn mobile-only" title="Wishlist">
              <IconHeart filled={wishlistCount > 0} />
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </Link>
            {user && (
              <Link to="/cart" className="nav-icon-btn mobile-only" title="Cart">
                <IconCart />
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </Link>
            )}
            <button
              className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile overlay */}
      <div
        className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>

        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border-light)',
            marginBottom: 'var(--space-3)'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 18
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{user.email}</div>
            </div>
          </div>
        )}

        <Link to="/" className="mobile-nav-link">🏠 Home</Link>
        <Link to="/products" className="mobile-nav-link">🛍️ Shop All</Link>
        <Link to="/wishlist" className="mobile-nav-link">
          ❤️ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
        </Link>
        {user && (
          <>
            <Link to="/cart" className="mobile-nav-link">
              🛒 Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link to="/orders" className="mobile-nav-link">📦 My Orders</Link>
          </>
        )}
        {user && user.role === 'ADMIN' && (
          <Link to="/admin" className="mobile-nav-link">⚙️ Admin Dashboard</Link>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)' }}>
          <button
            className="btn btn-secondary w-full"
            style={{ justifyContent: 'center', marginBottom: 'var(--space-3)' }}
            onClick={() => setIsDark((d) => !d)}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary w-full" style={{ justifyContent: 'center', marginBottom: 'var(--space-2)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-danger w-full" style={{ justifyContent: 'center' }} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
