import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'New Arrivals 2025',
    title: 'Shop the\nFuture Today',
    subtitle: 'Discover premium electronics, fashion, and home essentials — all under one roof.',
    cta: 'Explore Now',
    ctaLink: '/products',
    ctaSecondary: 'View Deals',
    ctaSecondaryLink: '/products',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    emoji: '🚀',
  },
  {
    id: 2,
    eyebrow: 'Summer Sale — Up to 60% Off',
    title: 'Unbeatable\nPrices',
    subtitle: 'Smartphones, laptops, headphones and more at the lowest prices, guaranteed.',
    cta: 'Shop Sale',
    ctaLink: '/products',
    ctaSecondary: 'Browse All',
    ctaSecondaryLink: '/products',
    gradient: 'linear-gradient(135deg, #003973 0%, #E5E5BE 100%)',
    emoji: '⚡',
  },
  {
    id: 3,
    eyebrow: 'Fast Delivery Across India 🇮🇳',
    title: 'Everything\nDelivered Fast',
    subtitle: 'Order today, delivered in 2–5 business days. Free shipping on orders above ₹499.',
    cta: 'Start Shopping',
    ctaLink: '/products',
    ctaSecondary: 'Learn More',
    ctaSecondaryLink: '/products',
    gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    emoji: '📦',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-slide ${idx === current ? 'active' : ''}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Background gradient */}
          <div
            className="hero-slide-bg"
            style={{ background: slide.gradient }}
          />
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-10%', right: '5%',
            width: '45vw', height: '45vw',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', right: '20%',
            width: '30vw', height: '30vw',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }} />

          {/* Emoji illustration on right */}
          <div style={{
            position: 'absolute', right: '8%', top: '50%',
            fontSize: 'clamp(80px, 14vw, 200px)',
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s',
            transform: idx === current ? 'translateY(-50%) scale(1)' : 'translateY(-40%) scale(0.8)',
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {slide.emoji}
          </div>

          {/* Content */}
          <div className="hero-content">
            <span className="hero-eyebrow">{slide.eyebrow}</span>
            <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <div className="hero-ctas">
              <Link to={slide.ctaLink} className="btn btn-white btn-lg">
                {slide.cta} →
              </Link>
              <Link to={slide.ctaSecondaryLink} className="btn btn-ghost btn-lg">
                {slide.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="hero-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-5)',
        right: 'var(--space-6)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 'var(--font-size-xs)',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        animation: 'pulse 2s ease infinite',
      }}>
        Scroll ↓
      </div>
    </section>
  );
};

export default HeroCarousel;
