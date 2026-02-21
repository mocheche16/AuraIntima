import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../config/api_config';

const Login = ({ onLoginSuccess, onGoRegister }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { token, fullName, email, roles } = response.data;
      
      // Persistir sesión
      const userData = { token, fullName, email, roles };
      localStorage.setItem('aura_user', JSON.stringify(userData));
      
      onLoginSuccess(userData);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '5rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '1.5rem', textAlign: 'center' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'var(--accent-color)', 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <LogIn color="var(--bg-color)" size={30} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bienvenido</h1>
          <p style={{ color: 'rgba(248, 250, 252, 0.6)', fontSize: '0.9rem' }}>Ingresa a tu cuenta exclusiva</p>
        </header>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>EMAIL</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="email" 
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="admin@auraintima.com"
                style={{ ...inputStyle, paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>CONTRASEÑA</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="password" 
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ ...inputStyle, paddingLeft: '3rem' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: 'var(--accent-color)',
            color: 'var(--bg-color)',
            padding: '1.2rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <footer style={{ marginTop: '2rem', fontSize: '0.82rem', opacity: 0.5 }}>
          ¿No tienes cuenta?{' '}
          <span onClick={onGoRegister} style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600, opacity: 1 }}>
            Regístrate aquí
          </span>
        </footer>
      </div>
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
  outline: 'none',
  fontSize: '0.95rem'
};

export default Login;
