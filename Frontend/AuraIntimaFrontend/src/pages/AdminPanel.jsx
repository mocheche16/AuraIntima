import React, { useState } from 'react';
import { LayoutDashboard, Users, Package, LogOut, ChevronRight, ShieldCheck, ShoppingCart, BarChart3 } from 'lucide-react';
import AdminOverview from './admin/AdminOverview.jsx';
import AdminProducts from './admin/AdminProducts.jsx';
import AdminUsers from './admin/AdminUsers.jsx';
import AdminOrders from './admin/AdminOrders.jsx';
import AdminSales from './admin/AdminSales.jsx';

const AdminPanel = ({ currentToken }) => {
  const [activeSubView, setActiveSubView] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'DASHBOARD', icon: <LayoutDashboard size={20} /> },
    { id: 'sales', label: 'VENTAS', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'PEDIDOS', icon: <ShoppingCart size={20} /> },
    { id: 'products', label: 'PRODUCTOS', icon: <Package size={20} /> },
    { id: 'users', label: 'USUARIOS', icon: <Users size={20} /> },
  ];

  return (
    <div className="container" style={{ display: 'flex', gap: '2.5rem', marginTop: '1rem', minHeight: '70vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0 }}>
        <div style={{ padding: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <ShieldCheck color="var(--accent-color)" size={24} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.1em', opacity: 0.9 }}>ADMIN PANEL</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.2rem', borderRadius: '0.8rem',
                background: activeSubView === item.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
                color: activeSubView === item.id ? 'var(--bg-color)' : 'white',
                fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
                transition: 'all 0.3s ease', border: 'none', textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {item.icon}
                {item.label}
              </div>
              <ChevronRight size={14} opacity={activeSubView === item.id ? 1 : 0.4} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <header style={{ marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {menuItems.find(i => i.id === activeSubView)?.label}
          </h2>
        </header>

        <div>
          {activeSubView === 'overview' && (
            <AdminOverview currentToken={currentToken} onNavigate={setActiveSubView} />
          )}
          {activeSubView === 'sales' && (
            <AdminSales currentToken={currentToken} />
          )}
          {activeSubView === 'orders' && (
            <AdminOrders currentToken={currentToken} />
          )}
          {activeSubView === 'products' && (
            <AdminProducts currentToken={currentToken} />
          )}
          {activeSubView === 'users' && (
            <AdminUsers currentToken={currentToken} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
