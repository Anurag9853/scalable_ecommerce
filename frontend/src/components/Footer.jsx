import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand column */}
        <div>
          <span className="footer-brand">BharatMart</span>
          <p className="footer-tagline">
            India's premium shopping destination. Genuine products, best prices,
            and lightning-fast delivery across the country.
          </p>
          <div className="footer-social">
            <a href="#" className="footer-social-btn" aria-label="Twitter">𝕏</a>
            <a href="#" className="footer-social-btn" aria-label="Instagram">📸</a>
            <a href="#" className="footer-social-btn" aria-label="Facebook">𝔽</a>
            <a href="#" className="footer-social-btn" aria-label="YouTube">▶</a>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter" style={{ marginTop: 'var(--space-6)' }}>
            <p className="footer-newsletter-label">
              {subscribed ? '✅ You\'re subscribed!' : 'Get deals & offers in your inbox'}
            </p>
            {!subscribed && (
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
              </form>
            )}
          </div>
        </div>

        {/* Shop column */}
        <div>
          <h3 className="footer-col-title">Shop</h3>
          <div className="footer-links">
            <Link to="/products?category=Electronics" className="footer-link">Electronics</Link>
            <Link to="/products?category=Kitchen+%26+Home" className="footer-link">Kitchen &amp; Home</Link>
            <Link to="/products?category=Men" className="footer-link">Men</Link>
            <Link to="/products?category=Women" className="footer-link">Women</Link>
            <Link to="/products?category=Kids+%26+Baby" className="footer-link">Kids &amp; Baby</Link>
            <Link to="/products?category=Student+Essentials" className="footer-link">Student Essentials</Link>
            <Link to="/products?category=Health+%26+Personal+Care" className="footer-link">Health &amp; Wellness</Link>
          </div>
        </div>

        {/* Company column */}
        <div>
          <h3 className="footer-col-title">Company</h3>
          <div className="footer-links">
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Investor Relations</a>
            <a href="#" className="footer-link">Sustainability</a>
          </div>
        </div>

        {/* Support column */}
        <div>
          <h3 className="footer-col-title">Support</h3>
          <div className="footer-links">
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Track My Order</a>
            <a href="#" className="footer-link">Returns &amp; Refunds</a>
            <a href="#" className="footer-link">Shipping Info</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--space-5) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border-light)' }}>
        <p className="footer-bottom-text">
          © 2025 BharatMart Pvt. Ltd. All rights reserved. Built with ❤️ in India 🇮🇳
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <span className="footer-bottom-text">💳 Visa &nbsp;|&nbsp; Mastercard &nbsp;|&nbsp; UPI &nbsp;|&nbsp; NetBanking &nbsp;|&nbsp; Razorpay</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
