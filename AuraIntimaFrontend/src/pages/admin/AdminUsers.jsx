import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Pencil, Trash2, Shield, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../../config/api_config';

const API = `${API_BASE_URL}/users`;

const emptyUser = { fullName: '', email: '', password: '', roles: ['User'] };

const AdminUsers = ({ currentToken }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'form'

  const headers = { Authorization: `Bearer ${currentToken}` };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setForm(prev => {
      const roles = prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const startEdit = (user) => {
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't show password
      roles: user.roles
    });
    setEditingId(user.id);
    setView('form');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar al usuario "${name}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, { headers });
      setStatus({ type: 'success', message: 'Usuario eliminado.' });
      fetchUsers();
    } catch {
      setStatus({ type: 'error', message: 'Error al eliminar usuario.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Guardando...' });
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form, { headers });
        setStatus({ type: 'success', message: 'Usuario actualizado.' });
      } else {
        await axios.post(API, form, { headers });
        setStatus({ type: 'success', message: 'Usuario creado.' });
      }
      setForm(emptyUser);
      setEditingId(null);
      setView('list');
      fetchUsers();
    } catch (err) {
      setStatus({ type: 'error', message: 'Error al guardar usuario.' });
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Gestión de Usuarios</h3>
        <button 
          onClick={() => { setForm(emptyUser); setEditingId(null); setView(view === 'list' ? 'form' : 'list'); }}
          style={{ background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.6rem 1.2rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {view === 'list' ? <><UserPlus size={16} /> NUEVO USUARIO</> : 'VOLVER A LISTA'}
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
                <th style={{ padding: '1.2rem' }}>NOMBRE</th>
                <th style={{ padding: '1.2rem' }}>EMAIL</th>
                <th style={{ padding: '1.2rem' }}>ROLES</th>
                <th style={{ padding: '1.2rem' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{u.fullName}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {u.roles.map(r => (
                        <span key={r} style={{ fontSize: '0.65rem', background: r === 'Admin' ? '#6366f120' : '#eee2', color: r === 'Admin' ? '#a5b4fc' : 'white', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontWeight: 700 }}>{r.toUpperCase()}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(u)} style={{ background: 'none', color: '#6366f1' }}><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(u.id, u.fullName)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', maxWidth: '600px' }}>
          <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{editingId ? 'Editar Usuario' : 'Crear Usuario'}</h4>
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            <div>
              <label style={labelStyle}>NOMBRE COMPLETO</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input name="email" value={form.email} onChange={handleChange} required type="email" style={inputStyle} disabled={!!editingId} />
            </div>
            <div>
              <label style={labelStyle}>CONTRASEÑA {editingId && '(dejar vacío para no cambiar)'}</label>
              <input name="password" value={form.password} onChange={handleChange} required={!editingId} type="password" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ROLES</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {['Admin', 'User', 'Invitado'].map(role => (
                  <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.roles.includes(role)} onChange={() => handleRoleToggle(role)} />
                    {role}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '2rem', background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '1rem', borderRadius: '0.8rem', fontWeight: 700 }}>
            {editingId ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
          </button>
        </form>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.4rem', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', color: 'white', borderRadius: '0.5rem', outline: 'none' };

export default AdminUsers;
