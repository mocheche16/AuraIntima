import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, DollarSign, ShoppingBag, Target, ArrowUpRight, ArrowDownRight, Award, Calendar } from 'lucide-react';

const AdminSales = ({ currentToken }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5226/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentToken]);

  if (loading) return <div style={{ padding: '2rem', opacity: 0.5 }}>Analizando datos de ventas...</div>;

  const topProducts = data?.topProducts || [];
  const maxSold = Math.max(...topProducts.map(p => p.totalSold), 1);
  const dailySales = data?.dailySales || [];
  const maxDayAmount = Math.max(...dailySales.map(d => d.amount), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard 
          title="TICKET PROMEDIO" 
          value={`$${(data?.averageTicket || 0).toFixed(2)}`} 
          icon={<Target size={20} />} 
          trend="+4.2%" 
          color="#6366f1" 
        />
        <MetricCard 
          title="CRECIMIENTO MENSUAL" 
          value={`${data?.monthlyGrowth || 0}%`} 
          icon={<TrendingUp size={20} />} 
          trend="+2.1%" 
          color="#10b981" 
          isPositive={true}
        />
        <MetricCard 
          title="RECAUDACIÓN TOTAL" 
          value={`$${(data?.totalSales || 0).toLocaleString()}`} 
          icon={<DollarSign size={20} />} 
          trend="+12%" 
          color="#f59e0b" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '400px' }}>
        {/* Top Products Chart (Custom Bar Chart) */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award size={18} color="var(--accent-color)" /> PRODUCTOS MÁS VENDIDOS
            </h4>
            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>POR UNIDADES</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            {topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600 }}>{p.productName}</span>
                  <span style={{ opacity: 0.6 }}>{p.totalSold} u.</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                        style={{ 
                            height: '100%', 
                            width: `${(p.totalSold / maxSold) * 100}%`, 
                            background: `linear-gradient(90deg, #6366f1, #a855f7)`,
                            borderRadius: '4px',
                            transition: 'width 1s ease-out'
                        }} 
                    />
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p style={{ opacity: 0.3, textAlign: 'center', marginTop: '2rem' }}>No hay datos suficientes.</p>}
          </div>
        </div>

        {/* Sales Trend (Custom SVG Area Chart) */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={18} color="#10b981" /> TENDENCIA - ÚLTIMOS 30 DÍAS
            </h4>
          </div>

          <div style={{ flex: 1, position: 'relative', marginTop: '1rem' }}>
            {dailySales.length > 1 ? (
                <svg viewBox="0 0 400 150" style={{ width: '100%', height: '150px', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Path line */}
                    <path 
                        d={generatePath(dailySales, maxDayAmount)} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                    />
                    {/* Gradient Area */}
                    <path 
                         d={`${generatePath(dailySales, maxDayAmount)} L 380 150 L 20 150 Z`}
                         fill="url(#salesGradient)"
                    />
                </svg>
            ) : (
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                    Datos históricos en proceso...
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>
                <span>Hace 30 días</span>
                <span>Hoy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend, color, isPositive = true }) => (
  <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.2rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', opacity: 0.6 }}>
      <div style={{ color }}>{icon}</div>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>{title}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{value}</h2>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isPositive ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center' }}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
      </span>
    </div>
    {/* Decorative background circle */}
    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: `${color}10` }} />
  </div>
);

const generatePath = (data, max) => {
    if (!data.length) return "";
    const width = 360;
    const height = 150;
    const padding = 20;
    
    return data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * width;
        const y = height - (d.amount / max) * (height - 20);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
};

export default AdminSales;
