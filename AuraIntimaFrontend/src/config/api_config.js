const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5226/api')
  : 'https://auraintima-production.up.railway.app/api';

console.log("FINAL API URL:", API_BASE_URL);

export default API_BASE_URL;
