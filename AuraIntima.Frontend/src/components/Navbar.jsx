import React from 'react';
import { ShoppingBag, User } from 'lucide-react';

const Navbar = ({ onViewChange }) => {
  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1.2rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div 
          onClick={() => onViewChange('catalog')}
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: 'var(--accent-color)', 
            cursor: 'pointer',
            letterSpacing: '0.2em'
          }}
        >
          AURA ÍNTIMA
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a onClick={() => onViewChange('catalog')} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>CATÁLOGO</a>
          <a onClick={() => onViewChange('admin')} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>ADMIN</a>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
            <ShoppingBag size={20} style={{ cursor: 'pointer', color: 'var(--accent-color)' }} />
            <User size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
