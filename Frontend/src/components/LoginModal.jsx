import React, { useContext, useState } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login({ onClose, onLogin, onShowSignup }) {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      // include username returned by server into auth context
      login({ token: data.token, role: data.role, name: data.name, username: data.username });
      // if used as modal, notify parent and close
      if (onLogin) onLogin();
      if (onClose) onClose();
      // fallback navigation when used as full page
      if (!onLogin) {
        nav("/dashboard");
      }
    } catch (e) {
      setErr(e?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #dcfce7, #bbf7d0, #86efac)",
        padding: "16px",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          border: "1px solid #86efac",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 16px",
            backgroundColor: "#16a34a",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "28px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          ⚡
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "700",
            color: "#15803d",
          }}
        >
          CarbonAware
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#4b5563",
            marginTop: "4px",
          }}
        >
          Login to access your dashboard
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "32px" }}>
          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </div>

          {/* Error */}
          {err && (
            <div
              style={{
                marginBottom: "16px",
                fontSize: "14px",
                color: "#b91c1c",
                backgroundColor: "#fee2e2",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              {err}
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                backgroundColor: loading ? "#86efac" : "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onShowSignup) {
                  if (onClose) onClose();
                  onShowSignup();
                } else {
                  nav("/register");
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#15803d",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register
            </button>
          </div>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "24px",
          }}
        >
          Secure access • CarbonAware
        </p>
      </div>
    </div>
  );
}
