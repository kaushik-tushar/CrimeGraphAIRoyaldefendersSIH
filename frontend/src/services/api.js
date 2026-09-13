/**
 * Core API Service Client
 * Handles authenticated HTTP requests, JWT token injection, and global session expiration handling.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api/v1';

/**
 * Custom fetch wrapper with request and response interceptors
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('tactical_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle token expiration / unauthorized response
    if (response.status === 401) {
      localStorage.removeItem('tactical_auth_token');
      localStorage.removeItem('tactical_auth_user');
      window.location.href = '/login?expired=true';
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
    }

    // Handle empty 204 No Content response
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;