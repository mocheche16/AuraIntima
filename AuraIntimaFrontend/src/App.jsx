import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Catalog from './pages/Catalog.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Checkout from './pages/Checkout.jsx'
import { CartProvider } from './context/CartContext.jsx'

function App() {
  const [view, setView] = useState('catalog')
  const [user, setUser] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    if (userData?.roles?.includes('Admin')) {
      setView('admin')
    } else {
      setView('catalog')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('aura_user')
    setUser(null)
    setView('catalog')
  }

  return (
    <CartProvider>
      <div className="App">
        <Navbar
          onViewChange={setView}
          user={user}
          onLogout={handleLogout}
          onCartOpen={() => setCartOpen(true)}
        />

        <CartDrawer 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
          onCheckout={() => setView('checkout')}
        />

        <main style={{ paddingBottom: '5rem', minHeight: '60vh' }}>
          {view === 'catalog' && <Catalog />}

          {view === 'admin' && user?.roles?.includes('Admin') && (
            <AdminPanel currentToken={user.token} />
          )}

          {view === 'admin' && (!user || !user?.roles?.includes('Admin')) && (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h2 style={{ color: '#f87171' }}>ACCESO RESTRINGIDO</h2>
              <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Debes iniciar sesión como administrador.</p>
              <button
                onClick={() => setView('login')}
                style={{ marginTop: '1.5rem', background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700 }}
              >
                IR A LOGIN
              </button>
            </div>
          )}

          {view === 'login' && (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onGoRegister={() => setView('register')}
            />
          )}

          {view === 'register' && (
            <Register
              onLoginSuccess={handleLoginSuccess}
              onGoLogin={() => setView('login')}
            />
          )}

          {view === 'checkout' && (
            <Checkout user={user} onBack={setView} />
          )}
        </main>

        <footer className="glass" style={{
          marginTop: '5rem', padding: '3rem 0', textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div className="container">
            <p 
              style={{ color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '0.2em', marginBottom: '1rem', cursor: 'default', userSelect: 'none' }}
            >
              AURA ÍNTIMA
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              &copy; 2026 Boutique E-commerce. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}

export default App
