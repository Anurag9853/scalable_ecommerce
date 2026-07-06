import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import HeroCarousel from '../components/HeroCarousel';
import CategorySection from '../components/CategorySection';
import ProductSlider from '../components/ProductSlider';

/* ── Intersection Observer for scroll animations ──────────── */
const useScrollAnimation = () => {
  useEffect(() => {
    const targets = document.querySelectorAll('.fade-in-up, .fade-in');
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
};

/* ── Trust Bar ────────────────────────────────────────────── */
const TrustBar = () => (
  <div style={{
    background: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border-light)',
    borderTop: '1px solid var(--color-border-light)',
    padding: 'var(--space-4) var(--space-6)',
  }}>
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      gap: 'var(--space-4)', flexWrap: 'wrap',
    }}>
      {[
        { icon: '🚚', text: 'Free Delivery above ₹499' },
        { icon: '🔄', text: 'Easy 30-Day Returns' },
        { icon: '🔒', text: 'Secure Payments' },
        { icon: '✅', text: '100% Genuine Products' },
        { icon: '📞', text: '24/7 Customer Support' },
      ].map((item) => (
        <div key={item.text} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          {item.text}
        </div>
      ))}
    </div>
  </div>
);

/* ── Promo Banner ─────────────────────────────────────────── */
const PromoBanner = () => (
  <section className="section-padding fade-in-up">
    <div className="section-container">
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-10) var(--space-10)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--space-6)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 100, bottom: -80,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 'var(--font-size-xs)', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', marginBottom: 8,
          }}>
            Limited Time Offer
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800,
            color: '#ffffff', marginBottom: 8,
            lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Get ₹500 Off Your First Order
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-base)' }}>
            Use code <strong style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 6 }}>WELCOME500</strong> at checkout
          </p>
        </div>
        <Link to="/products" className="btn btn-white btn-lg" style={{ position: 'relative', zIndex: 1 }}>
          Shop Now →
        </Link>
      </div>
    </div>
  </section>
);

/* ── Stats Section ────────────────────────────────────────── */
const StatsSection = () => (
  <section style={{
    background: 'var(--color-bg-secondary)',
    padding: 'var(--space-12) 0',
    borderTop: '1px solid var(--color-border-light)',
  }}>
    <div className="section-container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-6)',
        textAlign: 'center',
      }}>
        {[
          { number: '10L+', label: 'Happy Customers' },
          { number: '50K+', label: 'Products Listed' },
          { number: '500+', label: 'Trusted Brands' },
          { number: '99.2%', label: 'Delivery Success Rate' },
        ].map((stat) => (
          <div key={stat.label} className="fade-in-up">
            <div style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 4,
            }}>{stat.number}</div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── HomePage ─────────────────────────────────────────────── */
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get('/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useScrollAnimation();

  // Derive sections from fetched products
  const byRating = [...products].sort((a, b) => (b.rating || 4) - (a.rating || 4));
  const byPrice  = [...products].sort((a, b) => (a.pricing?.price ?? a.price) - (b.pricing?.price ?? b.price));
  const byPriceDesc = [...products].sort((a, b) => (b.pricing?.price ?? b.price) - (a.pricing?.price ?? a.price));
  const electronics = products.filter((p) =>
    ['Electronics', 'Smartphones', 'Laptops'].some((c) => p.category?.includes(c))
  );
  const recent = [...products].reverse();

  return (
    <>
      {/* Hero */}
      <HeroCarousel />

      {/* Trust strip */}
      <TrustBar />

      {/* Categories */}
      <CategorySection />

      {/* Trending Products */}
      <ProductSlider
        title="🔥 Trending Now"
        subtitle="Most popular products this week"
        products={byRating.slice(0, 12)}
        loading={loading}
        seeAllLink="/products"
      />

      {/* Best Sellers */}
      <ProductSlider
        title="⭐ Best Sellers"
        subtitle="Top-rated by our customers"
        products={byRating.slice(0, 10)}
        loading={loading}
        seeAllLink="/products"
      />

      {/* Electronics */}
      {(electronics.length > 0 || loading) && (
        <ProductSlider
          title="⚡ Electronics"
          subtitle="Gadgets and tech for everyday life"
          products={electronics.slice(0, 10)}
          loading={loading}
          seeAllLink="/products?category=Electronics"
        />
      )}

      {/* Promo banner */}
      <PromoBanner />

      {/* Budget Picks */}
      <ProductSlider
        title="💰 Budget Picks"
        subtitle="Premium quality at unbeatable prices"
        products={byPrice.slice(0, 12)}
        loading={loading}
        seeAllLink="/products"
      />

      {/* Premium Collection */}
      <ProductSlider
        title="✨ Premium Collection"
        subtitle="Curated selection for discerning buyers"
        products={byPriceDesc.slice(0, 10)}
        loading={loading}
        seeAllLink="/products"
      />

      {/* New Arrivals */}
      <ProductSlider
        title="🆕 New Arrivals"
        subtitle="Just landed on BharatMart"
        products={recent.slice(0, 12)}
        loading={loading}
        seeAllLink="/products"
      />

      {/* Stats */}
      <StatsSection />
    </>
  );
};

export default HomePage;
