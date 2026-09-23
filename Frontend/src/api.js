import axios from 'axios';

function base64UrlDecode(input) {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
}

function isExpiredJwt(token) {
    try {
        const payload = token.split('.')[1];
        if (!payload) return true;
        const decoded = JSON.parse(base64UrlDecode(payload));
        if (!decoded.exp) return false;
        return Date.now() >= decoded.exp * 1000;
    } catch {
        return true;
    }
}

export function clearStoredAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
}

export function getValidStoredToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (isExpiredJwt(token)) {
        clearStoredAuth();
        return null;
    }

    return token;
}

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const apiBaseUrl = configuredApiUrl?.endsWith('/api')
    ? configuredApiUrl
    : `${configuredApiUrl || 'http://localhost:5000'}/api`;

export const api = axios.create({
    baseURL: apiBaseUrl,
});

// Keep Authorization in sync even after login/logout without page reload.
api.interceptors.request.use((config) => {
    const token = getValidStoredToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
    }
    return config;
});

export default api;
