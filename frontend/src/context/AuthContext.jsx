import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProfile } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ fullName: "Jane Doe", email: "jane.doe@example.com" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("schedulex_token");
      const storedUser = localStorage.getItem("schedulex_user");
      if (token) {
        setIsAuthenticated(true);
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch (e) {}
        }
        try {
          const profileData = await fetchProfile();
          if (profileData && profileData.user) {
            setUser(profileData.user);
            localStorage.setItem("schedulex_user", JSON.stringify(profileData.user));
          }
        } catch (err) {
          console.error("Auth profile fetch error:", err);
        }
      } else if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (e) {}
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const authRoutes = ["/login", "/register"];
      if (authRoutes.includes(location.pathname)) {
        navigate("/dashboard", { replace: true });
      }
    }

    // Force Light Theme on Landing and Auth Pages, otherwise respect user preferences
    const lightOnlyRoutes = ["/", "/login", "/register"];
    if (lightOnlyRoutes.includes(location.pathname)) {
      document.body.classList.remove("dark-theme");
    } else {
      if (user?.preferences?.theme === "dark") {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    }
  }, [isAuthenticated, location.pathname, navigate, user?.preferences?.theme]);

  const login = (token, userData) => {
    localStorage.setItem("schedulex_token", token);
    if (userData) {
      localStorage.setItem("schedulex_user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  const updateUser = (newUserData) => {
    const merged = { ...user, ...newUserData };
    localStorage.setItem("schedulex_user", JSON.stringify(merged));
    setUser(merged);
  };

  const logout = () => {
    localStorage.removeItem("schedulex_token");
    localStorage.removeItem("schedulex_user");
    setIsAuthenticated(false);
    setUser({ fullName: "Jane Doe", email: "jane.doe@example.com" });
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
