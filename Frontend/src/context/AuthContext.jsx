import React, { createContext, useState } from 'react';
import { api } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [name, setName] = useState(localStorage.getItem('name') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  const login = ({ token, role, name, username }) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (role) localStorage.setItem('role', role);
    if (name) localStorage.setItem('name', name);
    if (username) localStorage.setItem('username', username);
    setToken(token || null);
    setRole(role || null);
    setName(name || null);
    setUsername(username || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setRole(null);
    setName(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
