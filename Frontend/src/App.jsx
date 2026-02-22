import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Resources from "./pages/Resources";
import Article from "./pages/Article";
import Dashboard from "./pages/Dashboard";
import Login from "./components/LoginModal";
import Register from "./components/SignupModal";
import SocialMenu from "./components/SocialMenu";

function AppContent() {
  const location = useLocation();
  const hideMenuPaths = ["/login", "/register"];
  const shouldShowMenu = !hideMenuPaths.includes(location.pathname);

  return (
    <>
      {shouldShowMenu && <SocialMenu variant="floating" />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
