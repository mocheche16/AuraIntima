import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminOverview = ({ currentToken, onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentToken]);

  if (loading) return <div style={{ padding: '2rem', opacity: 0.5 }}>Cargando estadísticas...</div>;

  const cards = [
    { title: 'PRODUCTOS', value: stats?.totalProducts || 0, icon: <Package size={24} />, color: '#6366f1', target: 'products' },
    { title: 'PEDIDOS', value: stats?.totalOrders || 0, icon: <TrendingUp size={24} />, color: '#10b981', target: 'orders' },
    { title: 'VENTAS TOTALES', value: `$${(stats?.totalSales || 0).toFixed(2)}`, icon: <ShieldCheck size={24} />, color: '#f59e0b', target: 'sales' },
    { title: 'USUARIOS', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: '#ec4899', target: 'users' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {cards.map((card, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>{card.title}</span>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: `${card.color}20`, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{card.value}</div>
            <button 
              onClick={() => onNavigate(card.target)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: card.color, fontWeight: 700, background: 'none', padding: 0 }}
            >
              GESTIONAR <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Actividad Reciente</h3>
        <p style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '0.9rem' }}>No hay actividad reciente para mostrar todavía.</p>
      </div>
    </div>
  );
};

export default AdminOverview;
