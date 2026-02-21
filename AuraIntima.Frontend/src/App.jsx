import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Catalog from './pages/Catalog.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

function App() {
  const [view, setView] = useState('catalog')

  return (
    <div className="App">
      <Navbar onViewChange={setView} />
      
      <main style={{ paddingBottom: '5rem' }}>
        {view === 'catalog' && <Catalog />}
        {view === 'admin' && <AdminPanel />}
      </main>

      <footer className="glass" style={{ 
        marginTop: '5rem', 
        padding: '3rem 0', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="container">
          <p style={{ color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '0.2em', marginBottom: '1rem' }}>
            AURA ÍNTIMA
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
            &copy; 2026 Boutique E-commerce. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
