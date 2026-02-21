import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // La API está en http://localhost:5226 (según logs anteriores)
        const response = await axios.get('http://localhost:5226/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos. Asegúrate de que la API esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>Cargando colección...</h2>
    </div>
  );

  if (error) return (
    <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
      <p style={{ color: '#ef4444' }}>{error}</p>
    </div>
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', borderLeft: '4px solid var(--accent-color)', paddingLeft: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Nuestra Colección</h1>
        <p style={{ color: 'rgba(248, 250, 252, 0.6)' }}>Elegancia y discreción en cada detalle.</p>
      </header>

      {products.length === 0 ? (
        <p>No hay productos disponibles en este momento.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
