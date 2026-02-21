import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateQty, totalPrice, totalItems, clearCart } = useCart();

  const handleProceed = () => {
    onCheckout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 200,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        width: '420px',
        maxWidth: '95vw',
        height: '100vh',
        background: 'var(--card-bg)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 300,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShoppingBag size={20} color="var(--accent-color)" />
            <span style={{ fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.95rem' }}>
              CARRITO {totalItems > 0 && <span style={{
                background: 'var(--accent-color)', color: 'var(--bg-color)',
                borderRadius: '50%', width: 20, height: 20,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, marginLeft: 6
              }}>{totalItems}</span>}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', padding: '0.4rem', borderRadius: '0.4rem', opacity: 0.7 }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 2rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.4 }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: '1rem', paddingBottom: '1.2rem',
                  marginBottom: '1.2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center'
                }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1582091223247-a8301317a095?auto=format&fit=crop&q=80&w=200'}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </p>
                    <p style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 700 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={qtyBtn}>
                      <Minus size={12} />
                    </button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.85rem' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={qtyBtn}>
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} style={{ ...qtyBtn, marginLeft: 4, color: '#f87171' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-color)' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={handleProceed}
              style={{
                width: '100%', background: 'var(--accent-color)',
                color: 'var(--bg-color)', padding: '1rem',
                borderRadius: '0.8rem', fontWeight: 700, letterSpacing: '0.15em',
                fontSize: '0.85rem', marginBottom: '0.6rem'
              }}
            >
              PROCEDER AL PAGO
            </button>
            <button onClick={clearCart} style={{
              width: '100%', background: 'none',
              color: 'rgba(248,250,252,0.4)', fontSize: '0.75rem',
              letterSpacing: '0.05em'
            }}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const qtyBtn = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '0.3rem', padding: '0.3rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer'
};

export default CartDrawer;
