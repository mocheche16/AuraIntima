import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register = ({ onLoginSuccess, onGoLogin }) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    setStatus({ type: 'info', message: 'Registrando...' });
    try {
      const res = await axios.post('http://localhost:5226/api/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });

      const data = res.data;
      const userData = {
        token: data.token,
        refreshToken: data.refreshToken,
        fullName: data.fullName,
        roles: data.roles || ['User']
      };
      
      localStorage.setItem('aura_user', JSON.stringify(userData));
      onLoginSuccess(userData);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Error al registrarse.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: '3rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <UserPlus size={40} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.15em' }}>CREAR CUENTA</h1>
          <p style={{ opacity: 0.5, fontSize: '0.85rem', marginTop: '0.5rem' }}>Únete a Aura Íntima</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'NOMBRE COMPLETO', name: 'fullName', type: 'text', placeholder: 'Tu nombre' },
            { label: 'EMAIL', name: 'email', type: 'email', placeholder: 'tu@email.com' },
            { label: 'CONTRASEÑA', name: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'CONFIRMAR CONTRASEÑA', name: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                required
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          {status.message && (
            <div style={{
              padding: '1rem', borderRadius: '0.7rem', marginBottom: '1.2rem',
              background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: status.type === 'success' ? '#4ade80' : '#f87171',
              display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem'
            }}>
              {status.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {status.message}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: 'var(--accent-color)',
            color: 'var(--bg-color)', padding: '1.1rem',
            borderRadius: '0.8rem', fontWeight: 700,
            letterSpacing: '0.2em', fontSize: '0.85rem',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'CREANDO CUENTA...' : 'REGISTRARME'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', opacity: 0.5 }}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={onGoLogin} style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', background: 'var(--input-bg)',
  border: '1px solid rgba(255,255,255,0.07)',
  padding: '1rem', color: 'white',
  borderRadius: '0.7rem', outline: 'none',
  fontSize: '0.9rem'
};

export default Register;
