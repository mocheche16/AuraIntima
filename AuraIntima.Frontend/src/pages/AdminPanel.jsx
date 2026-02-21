import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminPanel = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    isAdultOnly: false,
    categoryId: 1 // Default category for testing
  });

  const [token, setToken] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Enviando...' });

    try {
      // Intentamos enviar el POST a la API
      await axios.post('http://localhost:5226/api/products', {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setStatus({ type: 'success', message: '¡Producto agregado con éxito!' });
      setProduct({ name: '', description: '', price: '', stock: '', imageUrl: '', isAdultOnly: false, categoryId: 1 });
    } catch (err) {
      console.error('Error adding product:', err);
      const errorMsg = err.response?.status === 401 
        ? 'No autorizado. Verifica tu token JWT Admin.' 
        : 'Error al conectar con la API.';
      setStatus({ type: 'error', message: errorMsg });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck color="var(--accent-color)" /> PANEL ADMINISTRADOR
        </h1>
        <p style={{ color: 'rgba(248, 250, 252, 0.6)' }}>Gestión discreta de inventario.</p>
      </header>

      <section className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Configuración de Seguridad
        </h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>TOKEN JWT ADMIN</label>
          <input 
            type="password"
            placeholder="Pega aquí tu token JWT obtenido en /login"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '1rem',
              color: 'white',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={20} /> Nuevo Producto
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>NOMBRE PRODUCTO</label>
            <input name="name" value={product.name} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>DESCRIPCIÓN</label>
            <textarea name="description" value={product.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>PRECIO ($)</label>
            <input type="number" step="0.01" name="price" value={product.price} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>STOCK</label>
            <input type="number" name="stock" value={product.stock} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>URL IMAGEN</label>
            <input name="imageUrl" value={product.imageUrl} onChange={handleChange} placeholder="https://..." style={inputStyle} />
          </div>
        </div>

        {status.message && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {status.type === 'error' && <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <button type="submit" style={{
          marginTop: '2rem',
          width: '100%',
          background: 'var(--accent-color)',
          color: 'var(--bg-color)',
          padding: '1.2rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          GUARDAR PRODUCTO
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'var(--input-bg)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '1rem',
  color: 'white',
  borderRadius: '0.5rem',
  outline: 'none'
};

export default AdminPanel;
