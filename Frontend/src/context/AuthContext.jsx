import React, { createContext, useState } from "react";
import { api, clearStoredAuth, getValidStoredToken } from "../api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedToken = getValidStoredToken();
  const [token, setToken] = useState(storedToken);
  const [role, setRole] = useState(
    storedToken ? localStorage.getItem("role") || null : null,
  );
  const [name, setName] = useState(
    storedToken ? localStorage.getItem("name") || null : null,
  );
  const [username, setUsername] = useState(
    storedToken ? localStorage.getItem("username") || null : null,
  );

  const login = ({ token, role, name, username }) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (role) localStorage.setItem("role", role);
    if (name) localStorage.setItem("name", name);
    if (username) localStorage.setItem("username", username);
    setToken(token || null);
    setRole(role || null);
    setName(name || null);
    setUsername(username || null);
  };

  const logout = () => {
    clearStoredAuth();
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setRole(null);
    setName(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, name, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
