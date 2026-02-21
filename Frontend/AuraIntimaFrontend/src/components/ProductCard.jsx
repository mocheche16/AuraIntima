import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="glass"
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        transition: 'transform 0.4s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: '280px', overflow: 'hidden', background: '#111', position: 'relative' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1582091223247-a8301317a095?auto=format&fit=crop&q=80&w=800'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#f87171', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.85rem' }}>SIN STOCK</span>
          </div>
        )}
      </div>
      <div style={{ padding: '1.4rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', fontWeight: 600 }}>{product.name}</h3>
        <p style={{ color: 'rgba(248,250,252,0.55)', fontSize: '0.8rem', marginBottom: '1.1rem', height: '2.4rem', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-color)' }}>
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              background: added ? '#4ade80' : 'var(--accent-color)',
              color: 'var(--bg-color)',
              padding: '0.55rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              fontWeight: 700, fontSize: '0.8rem',
              transition: 'background 0.3s ease',
              opacity: product.stock === 0 ? 0.4 : 1,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {added ? <Check size={15} /> : <ShoppingCart size={15} />}
            {added ? '¡AÑADIDO!' : 'AÑADIR'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
