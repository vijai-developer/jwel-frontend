import axios from 'axios';

// =====================================================
// Main API Instance
// Used for all /api/... endpoints
// =====================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://jwel-backend-production.up.railway.app/api',

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// =====================================================
// Request Interceptor
// Automatically attaches JWT token to requests
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// Response Interceptor
// Clears authentication data when JWT is rejected
// =====================================================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);


// =====================================================
// Authentication API Instance
//
// Backend authentication endpoint:
// http://localhost:8081/admin/login
//
// Notice: this endpoint does NOT contain /api
// =====================================================

export const AUTH_API = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API_BASE_URL ||
    'https://jwel-backend-production.up.railway.app',

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// =====================================================
// Authentication Request Interceptor
// Attaches JWT if one already exists
// =====================================================

AUTH_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// Export Main API
// =====================================================

export default API;