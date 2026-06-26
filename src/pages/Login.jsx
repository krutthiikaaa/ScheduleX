import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 100% 0%, rgba(214,90,49,0.1) 0%, var(--bg) 50%)",
      padding: 24,
      fontFamily: "var(--font)"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: "48px 40px", position: "relative", zIndex: 10, boxShadow: "var(--shadow-lg)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "var(--primary)", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 28, fontWeight: 800, marginBottom: 16, boxShadow: "0 8px 24px rgba(214, 90, 49, 0.25)" }}>
            S
          </div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Sign in to continue to ScheduleX</p>
        </div>

        {error && (
          <div style={{ background: "var(--danger-light)", color: "var(--danger)", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: 24, fontSize: "0.9rem", border: "1px solid rgba(217, 83, 79, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", fontWeight: 600 }}>Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@university.edu"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Forgot Password Flow"); }} style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>Forgot password?</a>
            </div>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.9rem" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={formData.remember}
              onChange={e => setFormData({...formData, remember: e.target.checked})}
              style={{ width: 16, height: 16, accentColor: "var(--primary)" }} 
            />
            <label htmlFor="remember" style={{ fontSize: "0.9rem", color: "var(--text-muted)", cursor: "pointer", userSelect: "none" }}>Remember me for 30 days</label>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 16, fontSize: "1rem", marginTop: 8 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;