import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton-card" style={{ overflow: 'hidden' }}>
    {/* Image skeleton */}
    <div
      className="skeleton"
      style={{ width: '100%', aspectRatio: '1', borderRadius: 0 }}
    />
    {/* Body */}
    <div style={{ padding: 'var(--space-4)' }}>
      <div className="skeleton" style={{ height: 10, width: '50%', marginBottom: 8, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 12, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 10, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 34, width: '100%', borderRadius: 20 }} />
    </div>
  </div>
);

export const SkeletonSlider = ({ count = 5 }) => (
  <div style={{ display: 'flex', gap: 'var(--space-4)', overflow: 'hidden' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ width: 240, flexShrink: 0 }}>
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export default SkeletonCard;
