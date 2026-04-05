import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home/Home";
import Calculator from "./pages/Calculator/Calculator";
import Resources from "./pages/Resources/Resources";
import Article from "./pages/Article/Article";
import Dashboard from "./pages/Dashboard/Dashboard";
import CommunityDashboard from "./pages/CommunityDashboard/CommunityDashboard";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import FeaturePreview from "./pages/FeaturePreview/FeaturePreview";
import Login from "./components/LoginModal/LoginModal";
import Register from "./components/SignupModal/SignupModal";
import SocialMenu from "./components/SocialMenu/SocialMenu";
import { AuthContext } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const hideMenuPaths = ["/login", "/register"];
  const shouldShowMenu = !hideMenuPaths.includes(location.pathname);

  return (
    <>
      {/* {shouldShowMenu && <SocialMenu variant="floating" />} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/features/:featureKey" element={<FeaturePreview />} />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:id"
          element={
            <ProtectedRoute>
              <Article />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community-dashboard"
          element={
            <ProtectedRoute>
              <CommunityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
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
