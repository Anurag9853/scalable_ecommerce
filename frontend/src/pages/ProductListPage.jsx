import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = [
  'Electronics', 'Kitchen & Home', 'Student Essentials',
  'Kids & Baby', 'Men', 'Women', 'Office & Study',
  'Health & Personal Care',
];

const SORT_OPTIONS = [
  { value: '',          label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
];

const ProductListPage = () => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search    = searchParams.get('search') || '';
  const category  = searchParams.get('category') || '';
  const sort      = searchParams.get('sort') || '';
  const minPrice  = searchParams.get('minPrice') || '';
  const maxPrice  = searchParams.get('maxPrice') || '';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get('/products', {
        params: {
          search: search || undefined,
          category: category || undefined,
          sort: sort || undefined,
        },
      });

      let result = data;
      if (minPrice) result = result.filter((p) => (p.pricing?.price ?? p.price) >= Number(minPrice));
      if (maxPrice) result = result.filter((p) => (p.pricing?.price ?? p.price) <= Number(maxPrice));

      setProducts(result);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p, { replace: true });
  };

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams);
    if (localMin) p.set('minPrice', localMin); else p.delete('minPrice');
    if (localMax) p.set('maxPrice', localMax); else p.delete('maxPrice');
    setSearchParams(p, { replace: true });
  };

  const clearAllFilters = () => setSearchParams({});

  const hasFilters = search || category || sort || minPrice || maxPrice;

  return (
    <div className="page-container" style={{ maxWidth: 1280 }}>
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="section-heading">
          {search ? `Results for "${search}"` : category || 'All Products'}
        </h1>
        <p className="section-subheading">
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      <div className="products-layout">
        {/* ── Sidebar Filters ─────────────────────────────── */}
        <aside className="products-sidebar">
          <div className="filter-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h2 className="filter-panel-title" style={{ margin: 0 }}>Filters</h2>
              {hasFilters && (
                <button
                  className="btn btn-sm"
                  style={{ background: 'none', color: 'var(--color-danger)', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 'var(--font-size-xs)', padding: 0 }}
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div className="filter-group">
              <div className="filter-group-title">Category</div>
              <div
                className={`filter-option ${!category ? 'active' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                <span>All Categories</span>
              </div>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className={`filter-option ${category === cat ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat === category ? '' : cat)}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={category === cat}
                    style={{ pointerEvents: 'none' }}
                  />
                  <span>{cat}</span>
                </div>
              ))}
            </div>

            {/* Price range */}
            <div className="filter-group">
              <div className="filter-group-title">Price Range (₹)</div>
              <div className="filter-price-row">
                <input
                  type="number"
                  className="filter-price-input"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                />
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>–</span>
                <input
                  type="number"
                  className="filter-price-input"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm w-full"
                style={{ marginTop: 'var(--space-3)' }}
                onClick={applyPriceFilter}
              >
                Apply
              </button>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <div className="filter-group-title">Sort By</div>
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className={`filter-option ${sort === opt.value ? 'active' : ''}`}
                  onClick={() => updateParam('sort', opt.value)}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={sort === opt.value}
                    style={{ pointerEvents: 'none', accentColor: 'var(--color-primary)' }}
                  />
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>

            {/* Rating filter (UI) */}
            <div className="filter-group">
              <div className="filter-group-title">Minimum Rating</div>
              {[4, 3, 2].map((r) => (
                <div key={r} className="filter-option">
                  <input type="checkbox" readOnly checked={false} style={{ pointerEvents: 'none' }} />
                  <span>{'⭐'.repeat(r)} &amp; above</span>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="filter-group">
              <div className="filter-group-title">Availability</div>
              <div className="filter-option">
                <input type="checkbox" readOnly checked={false} style={{ pointerEvents: 'none' }} />
                <span>In Stock Only</span>
              </div>
              <div className="filter-option">
                <input type="checkbox" readOnly checked={false} style={{ pointerEvents: 'none' }} />
                <span>Include Out of Stock</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Products Grid ─────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`btn btn-sm ${sort === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateParam('sort', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters chips */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              {search && (
                <span style={chipStyle}>
                  🔍 {search}
                  <button onClick={() => updateParam('search', '')} style={chipClose}>×</button>
                </span>
              )}
              {category && (
                <span style={chipStyle}>
                  📂 {category}
                  <button onClick={() => updateParam('category', '')} style={chipClose}>×</button>
                </span>
              )}
              {sort && (
                <span style={chipStyle}>
                  ↕ {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                  <button onClick={() => updateParam('sort', '')} style={chipClose}>×</button>
                </span>
              )}
              {minPrice && (
                <span style={chipStyle}>
                  Min ₹{minPrice}
                  <button onClick={() => { setLocalMin(''); updateParam('minPrice', ''); }} style={chipClose}>×</button>
                </span>
              )}
              {maxPrice && (
                <span style={chipStyle}>
                  Max ₹{maxPrice}
                  <button onClick={() => { setLocalMax(''); updateParam('maxPrice', ''); }} style={chipClose}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h2 className="empty-state-title">No products found</h2>
              <p className="empty-state-text">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button className="btn btn-primary" onClick={clearAllFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Products */}
          {!loading && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const chipStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'var(--color-primary-light)', color: 'var(--color-primary)',
  padding: '4px 10px', borderRadius: 'var(--radius-full)',
  fontSize: 'var(--font-size-xs)', fontWeight: 500,
};
const chipClose = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--color-primary)', fontWeight: 700, padding: 0, fontSize: 14,
};

export default ProductListPage;
