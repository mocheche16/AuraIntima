// Version: 1.0.2-CLOUD
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5226/api" 
    : "https://auraintima-production.up.railway.app/api");

console.log("FINAL API URL:", API_BASE_URL);

export default API_BASE_URL;
