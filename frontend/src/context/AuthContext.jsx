import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAuthMe, loginUser as apiLogin, registerUser as apiRegister, logoutUser as apiLogout } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("schedulex_token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthentication = useCallback(async () => {
    // 1. Check if token returned in URL from Google OAuth callback redirect
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const errorFromUrl = urlParams.get("error");

    if (tokenFromUrl) {
      localStorage.setItem("schedulex_token", tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (errorFromUrl) {
      console.error("Google OAuth Error:", errorFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const currentToken = tokenFromUrl || localStorage.getItem("schedulex_token");
    if (!currentToken || currentToken === "null" || currentToken === "undefined") {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setToken(currentToken);
      const userData = await fetchAuthMe();
      if (userData && userData.email) {
        setUser(userData);
        localStorage.setItem("schedulex_user", JSON.stringify(userData));
      } else {
        throw new Error("Invalid profile payload");
      }
    } catch (err) {
      console.error("Authentication check failed:", err.message);
      localStorage.removeItem("schedulex_token");
      localStorage.removeItem("schedulex_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Redirect away from auth routes if authenticated
  useEffect(() => {
    if (token && user && !loading) {
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
  }, [token, user, loading, location.pathname, navigate]);

  const login = async (email, password) => {
    const response = await apiLogin({ email, password });
    if (response.token && response.user) {
      localStorage.setItem("schedulex_token", response.token);
      localStorage.setItem("schedulex_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      navigate("/dashboard", { replace: true });
      return response.user;
    }
    throw new Error("Login failed");
  };

  const register = async ({ name, email, password, confirmPassword }) => {
    const response = await apiRegister({ name, email, password, confirmPassword });
    if (response.token && response.user) {
      localStorage.setItem("schedulex_token", response.token);
      localStorage.setItem("schedulex_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      navigate("/dashboard", { replace: true });
      return response.user;
    }
    throw new Error("Registration failed");
  };

  const googleLogin = (mode = 'login') => {
    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const BACKEND_BASE = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
    window.location.href = `${BACKEND_BASE}/auth/google?mode=${mode}`;
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("schedulex_token");
    localStorage.removeItem("schedulex_user");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const updateUser = (newUserData) => {
    const merged = { ...user, ...newUserData };
    localStorage.setItem("schedulex_user", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        checkAuthentication
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
