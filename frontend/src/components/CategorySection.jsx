import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Electronics',            icon: '⚡', color: '#dbeafe', iconBg: '#3b82f6', link: '/products?category=Electronics' },
  { name: 'Kitchen & Home',         icon: '🍳', color: '#fce7f3', iconBg: '#ec4899', link: '/products?category=Kitchen+%26+Home' },
  { name: 'Men',                    icon: '👔', color: '#e0e7ff', iconBg: '#6366f1', link: '/products?category=Men' },
  { name: 'Women',                  icon: '👗', color: '#fdf2f8', iconBg: '#d946ef', link: '/products?category=Women' },
  { name: 'Student Essentials',     icon: '🎒', color: '#fef9c3', iconBg: '#eab308', link: '/products?category=Student+Essentials' },
  { name: 'Kids & Baby',            icon: '🧸', color: '#dcfce7', iconBg: '#22c55e', link: '/products?category=Kids+%26+Baby' },
  { name: 'Health & Wellness',      icon: '💪', color: '#fff7ed', iconBg: '#f97316', link: '/products?category=Health+%26+Personal+Care' },
  { name: 'Office & Study',         icon: '💼', color: '#f0fdf4', iconBg: '#16a34a', link: '/products?category=Office+%26+Study' },
  { name: 'Smartphones',            icon: '📱', color: '#f0f9ff', iconBg: '#0ea5e9', link: '/products?search=phone' },
  { name: 'Accessories',            icon: '🎧', color: '#fdf4ff', iconBg: '#a855f7', link: '/products?search=earphone' },
];

const CategorySection = () => {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="section-header fade-in-up" style={{ marginBottom: 'var(--space-8)' }}>
          <div>
            <h2 className="section-heading">Shop by Category</h2>
            <p className="section-subheading">Explore our wide range of products</p>
          </div>
          <Link to="/products" className="section-see-all">View All →</Link>
        </div>

        <div className="categories-grid fade-in-up">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="category-card"
              style={{ background: cat.color }}
            >
              <div
                className="category-icon"
                style={{ background: cat.iconBg, fontSize: 32 }}
              >
                {cat.icon}
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
