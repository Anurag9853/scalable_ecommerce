import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { SkeletonSlider } from './SkeletonCard';

const ProductSlider = ({ title, subtitle, products, loading, seeAllLink }) => {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <div className="section-padding" style={{ paddingBottom: 0 }}>
      <div className="section-container">
        {/* Header */}
        <div className="section-header fade-in-up">
          <div>
            <h2 className="section-heading">{title}</h2>
            {subtitle && <p className="section-subheading">{subtitle}</p>}
          </div>
          {seeAllLink && (
            <Link to={seeAllLink} className="section-see-all">See All →</Link>
          )}
        </div>

        {/* Slider */}
        <div className="product-slider-wrap">
          {/* Nav buttons */}
          {!loading && products.length > 4 && (
            <>
              <button className="slider-nav slider-nav-left" onClick={() => scroll(-1)}>◀</button>
              <button className="slider-nav slider-nav-right" onClick={() => scroll(1)}>▶</button>
            </>
          )}

          {loading ? (
            <SkeletonSlider count={5} />
          ) : (
            <div className="product-slider" ref={sliderRef}>
              {products.map((product) => (
                <div key={product._id} className="product-slider-item">
                  <ProductCard product={product} />
                </div>
              ))}
              {products.length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-4)' }}>
                  No products to show.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
