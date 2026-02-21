// Version: 2026-02-21_01:56
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" 
    ? "http://localhost:5226/api" 
    : "https://auraintima-production.up.railway.app/api");

console.log("Resolved API URL V2:", API_BASE_URL);

export default API_BASE_URL;
