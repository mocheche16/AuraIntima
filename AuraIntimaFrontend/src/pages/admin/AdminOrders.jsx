import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Pencil, Trash2, X, CheckCircle, Package, MapPin, Calendar, DollarSign } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const API = `${API_BASE_URL}/orders`;

const emptyOrder = { userId: 'GUEST', shippingAddress: '', totalAmount: 0, orderItems: [] };

const AdminOrders = ({ currentToken }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyOrder);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'form'

  const headers = { Authorization: `Bearer ${currentToken}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes] = await Promise.all([
        axios.get(API, { headers }),
        axios.get(`${API_BASE_URL}/products`)
      ]);
      setOrders(ordRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addItemToOrder = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    setForm(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, { 
        productId: product.id, 
        productName: product.name, 
        quantity: 1, 
        unitPrice: product.price 
      }]
    }));
  };

  const updateItemQty = (index, qty) => {
    const items = [...form.orderItems];
    items[index].quantity = Math.max(1, parseInt(qty) || 1);
    setForm({ ...form, orderItems: items });
  };

  const removeItemFromOrder = (index) => {
    setForm({ ...form, orderItems: form.orderItems.filter((_, i) => i !== index) });
  };

  const startEdit = (order) => {
    setForm({
      userId: order.userId,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      orderItems: order.orderItems
    });
    setEditingId(order.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar pedido #${id}?`)) return;
    try {
      await axios.delete(`${API}/${id}`, { headers });
      setStatus({ type: 'success', message: 'Pedido eliminado.' });
      fetchData();
    } catch {
      setStatus({ type: 'error', message: 'Error al eliminar pedido.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.orderItems.length === 0) {
      setStatus({ type: 'error', message: 'El pedido debe tener al menos un producto.' });
      return;
    }
    
    setStatus({ type: 'info', message: 'Guardando...' });
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
            shippingAddress: form.shippingAddress,
            totalAmount: form.orderItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0)
        }, { headers });
        setStatus({ type: 'success', message: 'Pedido actualizado.' });
      } else {
        await axios.post(API, form, { headers });
        setStatus({ type: 'success', message: 'Pedido creado.' });
      }
      setForm(emptyOrder);
      setEditingId(null);
      setView('list');
      fetchData();
    } catch (err) {
      setStatus({ type: 'error', message: 'Error al guardar pedido.' });
    }
  };

  const calculateFormTotal = () => {
    return form.orderItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0).toFixed(2);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Gestión de Pedidos</h3>
        <button 
          onClick={() => { setForm(emptyOrder); setEditingId(null); setView(view === 'list' ? 'form' : 'list'); }}
          style={{ background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.6rem 1.2rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {view === 'list' ? <><Plus size={16} /> NUEVO PEDIDO</> : 'VOLVER A LISTA'}
        </button>
      </header>

      {status.message && (
        <div style={{ padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem', background: status.type === 'success' ? '#22c55e20' : '#ef444420', color: status.type === 'success' ? '#4ade80' : '#f87171', display: 'flex', justifyContent: 'space-between' }}>
          <span>{status.message}</span>
          <X size={16} onClick={() => setStatus({ type: '', message: '' })} style={{ cursor: 'pointer' }} />
        </div>
      )}

      {view === 'list' ? (
        <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', opacity: 0.5 }}>
              <tr>
                <th style={{ padding: '1.2rem' }}>ID</th>
                <th style={{ padding: '1.2rem' }}>CLIENTE</th>
                <th style={{ padding: '1.2rem' }}>FECHA</th>
                <th style={{ padding: '1.2rem' }}>TOTAL</th>
                <th style={{ padding: '1.2rem' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>#{o.id}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: 600 }}>{o.userId === 'GUEST' ? 'Invitado' : o.userId}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{o.shippingAddress}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 700 }}>
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(o)} style={{ background: 'none', color: '#6366f1' }}><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(o.id)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Cargando pedidos...</div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', maxWidth: '800px' }}>
          <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{editingId ? `Editar Pedido #${editingId}` : 'Nuevo Pedido Manual'}</h4>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>DIRECCIÓN DE ENVÍO</label>
              <textarea name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required style={{ ...inputStyle, minHeight: '80px' }} />
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)' }}>
              <label style={{ ...labelStyle, marginBottom: '1rem' }}>PRODUCTOS EN EL PEDIDO</label>
              
              {!editingId && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    <select 
                        onChange={(e) => { if(e.target.value) addItemToOrder(e.target.value); e.target.value = ""; }}
                        style={{ ...inputStyle, flex: 1 }}
                    >
                        <option value="">Añadir producto...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                        ))}
                    </select>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {form.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <Package size={16} opacity={0.5} />
                    <span style={{ flex: 1, fontSize: '0.85rem' }}>{item.productName || products.find(p => p.id === item.productId)?.name}</span>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateItemQty(idx, e.target.value)}
                      style={{ ...inputStyle, width: '60px', padding: '0.4rem' }}
                      disabled={!!editingId}
                    />
                    <span style={{ minWidth: '70px', textAlign: 'right', fontWeight: 700, fontSize: '0.85rem' }}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                    {!editingId && (
                      <button type="button" onClick={() => removeItemFromOrder(idx)} style={{ background: 'none', color: '#ef4444' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', textAlign: 'right' }}>
                <span style={{ opacity: 0.5, fontSize: '0.8rem', marginRight: '1rem' }}>TOTAL ESTIMADO:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-color)' }}>
                  ${calculateFormTotal()}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', marginTop: '2rem', background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '1rem', borderRadius: '0.8rem', fontWeight: 700 }}>
            {editingId ? 'ACTUALIZAR PEDIDO' : 'CREAR PEDIDO'}
          </button>
        </form>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.4rem', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', color: 'white', borderRadius: '0.5rem', outline: 'none' };

export default AdminOrders;
