const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" ? "http://localhost:5226/api" : "https://auraintima-production.up.railway.app/api");

console.log("Resolved API URL:", API_BASE_URL);

export default API_BASE_URL;
