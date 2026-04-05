import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);

  const isLoggedIn = !!token;
  const dashboardPath = role === "admin" ? "/admin/dashboard" : "/dashboard";
  const handleLogin = () => navigate("/login");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Clear local auth even if backend logout fails.
    }
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img
            src="/carbonaware-logo.svg"
            alt="CarbonAware"
            className="logo-mark"
          />
          <span>CarbonAware</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calculator">Carbon Calculator</Link>
            </li>
            <li>
              <Link to="/resources">Educational Resources</Link>
            </li>
            <li>
              <Link to="/community-dashboard">Community Dashboard</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to={dashboardPath}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-login">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={handleLogin} className="btn-login">
                    Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* login/register are full-page routes now */}
      </div>
    </header>
  );
};

export default Header;
