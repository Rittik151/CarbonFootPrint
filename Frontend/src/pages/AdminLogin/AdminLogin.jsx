import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { AuthContext } from "../../context/AuthContext";
import './AdminLogin.css';

export default function AdminLogin() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "dhadika45@gmail.com",
    password: "123456",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/admin/login", form);
      login({
        token: data.token,
        role: data.role,
        name: data.name,
        username: "admin",
      });
      nav("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.msg || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <h1>Admin Login</h1>
        <p>Use admin credentials to access website member activity.</p>

        <form onSubmit={onSubmit} className="admin-form">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </section>
    </main>
  );
}
