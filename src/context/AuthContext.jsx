import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("schedulex_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Redirect if logged in and trying to access public pages
    if (isAuthenticated) {
      const publicRoutes = ["/", "/login", "/register", "/landing"];
      if (publicRoutes.includes(location.pathname)) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const login = (token) => {
    localStorage.setItem("schedulex_token", token);
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("schedulex_token");
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
