import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="glass" style={{
      borderRadius: '1rem',
      overflow: 'hidden',
      transition: 'transform 0.4s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: '320px', overflow: 'hidden', background: '#111' }}>
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1582091223247-a8301317a095?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
        <p style={{ color: 'rgba(248, 250, 252, 0.6)', fontSize: '0.85rem', marginBottom: '1.2rem', height: '2.5rem', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-color)' }}>
            ${product.price.toFixed(2)}
          </span>
          <button style={{
            background: 'var(--accent-color)',
            color: 'var(--bg-color)',
            padding: '0.6rem 1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            <ShoppingCart size={16} />
            AÑADIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
