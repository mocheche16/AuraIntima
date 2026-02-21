import React from 'react';
import { ShoppingBag, User, LogOut, Shield, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const Navbar = ({ onViewChange, user, onLogout, onCartOpen }) => {
  const { totalItems } = useCart();

  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: '1.2rem 0', marginBottom: '2rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          onClick={() => onViewChange('catalog')}
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)', cursor: 'pointer', letterSpacing: '0.2em' }}
        >
          AURA ÍNTIMA
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a onClick={() => onViewChange('catalog')} style={navLinkStyle}>
            CATÁLOGO
          </a>

          {user?.roles?.includes('Admin') && (
            <a onClick={() => onViewChange('admin')} style={{ ...navLinkStyle, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={14} /> ADMIN PANEL
            </a>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '0.5rem', alignItems: 'center' }}>
            {/* Cart icon with badge */}
            <button onClick={onCartOpen} style={{ position: 'relative', background: 'none', padding: 0 }}>
              <ShoppingBag size={20} style={{ color: 'var(--accent-color)' }} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -7, right: -8,
                  background: 'var(--accent-color)', color: 'var(--bg-color)',
                  borderRadius: '50%', width: 17, height: 17,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.62rem', fontWeight: 800
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ textAlign: 'right', lineHeight: 1 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{user.fullName}</p>
                  <p style={{ fontSize: '0.62rem', opacity: 0.5, textTransform: 'uppercase' }}>{user.roles?.[0]}</p>
                </div>
                <LogOut size={18} onClick={onLogout} style={{ cursor: 'pointer', opacity: 0.7 }} title="Cerrar sesión" />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <User size={20} onClick={() => onViewChange('login')} style={{ cursor: 'pointer', opacity: 0.8 }} title="Iniciar sesión" />
                <UserPlus size={20} onClick={() => onViewChange('register')} style={{ cursor: 'pointer', color: 'var(--accent-color)' }} title="Registrarse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const navLinkStyle = { 
  cursor: 'pointer', 
  fontSize: '0.85rem', 
  fontWeight: 500, 
  letterSpacing: '0.1em',
  textTransform: 'uppercase'
};

export default Navbar;
