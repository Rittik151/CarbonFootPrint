import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { token, name, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const handleLogin = () => navigate("/login");
  const handleShowSignup = () => navigate("/register");

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          CarbonAware
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
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="btn-login"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogin} className="btn-login">
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* login/register are full-page routes now */}
      </div>
    </header>
  );
};

export default Header;
