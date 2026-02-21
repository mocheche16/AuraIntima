import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2, CheckCircle, AlertCircle, X, Package } from 'lucide-react';
import API_BASE_URL from '../../config/api_config';

const API = API_BASE_URL;

const emptyProduct = { name: '', description: '', price: '', stock: '', imageUrl: '', isAdultOnly: false, categoryId: 1 };

const AdminProducts = ({ currentToken }) => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'form'

  const headers = { Authorization: `Bearer ${currentToken}` };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const startEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      isAdultOnly: product.isAdultOnly || false,
      categoryId: product.categoryId || 1
    });
    setEditingId(product.id);
    setView('form');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      setStatus({ type: 'success', message: 'Producto eliminado.' });
      fetchProducts();
    } catch {
      setStatus({ type: 'error', message: 'Error al eliminar.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    try {
      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, payload, { headers });
        setStatus({ type: 'success', message: 'Producto actualizado.' });
      } else {
        await axios.post(`${API}/products`, payload, { headers });
        setStatus({ type: 'success', message: 'Producto creado.' });
      }
      setForm(emptyProduct);
      setEditingId(null);
      fetchProducts();
      setView('list');
    } catch {
      setStatus({ type: 'error', message: 'Error al guardar.' });
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Gestión de Inventario</h3>
        <button 
          onClick={() => { setForm(emptyProduct); setEditingId(null); setView(view === 'list' ? 'form' : 'list'); }}
          style={{ background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.6rem 1.2rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {view === 'list' ? <><PlusCircle size={16} /> NUEVO PRODUCTO</> : 'VOLVER A LISTA'}
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
                <th style={{ padding: '1.2rem' }}>PRODUCTO</th>
                <th style={{ padding: '1.2rem' }}>PRECIO</th>
                <th style={{ padding: '1.2rem' }}>STOCK</th>
                <th style={{ padding: '1.2rem' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img src={p.imageUrl || 'https://images.unsplash.com/photo-1582091223247-a8301317a095?auto=format&fit=crop&q=80&w=100'} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '0.4rem' }} alt="" />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: p.stock > 0 ? '#22c55e20' : '#ef444420', color: p.stock > 0 ? '#4ade80' : '#f87171', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>{p.stock} UDS</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(p)} style={{ background: 'none', color: '#6366f1' }}><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Cargando productos...</div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', maxWidth: '800px' }}>
          <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>NOMBRE</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <textarea name="description" value={form.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px' }} />
            </div>
            <div>
              <label style={labelStyle}>PRECIO ($)</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>STOCK</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>URL DE IMAGEN</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '2rem', background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '1rem', borderRadius: '0.8rem', fontWeight: 700 }}>
            {editingId ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
          </button>
        </form>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.4rem', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', color: 'white', borderRadius: '0.5rem', outline: 'none' };

export default AdminProducts;
