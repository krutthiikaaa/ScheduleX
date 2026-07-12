import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  const { login, googleLogin } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const err = urlParams.get("error");
    if (err === "oauth_failed") {
      setError("Google Sign-In failed or was cancelled. Please try again.");
    } else if (err === "server_error") {
      setError("Server error during authentication. Please try again later.");
    } else if (err === "account_not_found") {
      setError("No account exists with this Google account. Please click 'Sign Up' below to create an account first!");
    }
  }, [location.search]);

  const handleLogin = async (e) => {
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
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Branding Section */}
      <div className="auth-branding-panel">
        <Link to="/" className="auth-back-link">
          <span>←</span> Back to Home
        </Link>
        <div className="auth-branding-content">
          <h1>Organize Your Academic Life.</h1>
          <p className="auth-subheading">
            One workspace for your timetable, assignments, study resources, habits, and focus sessions.
          </p>
          
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">
                <h4>Smart Timetable</h4>
                <p>Automatically organize your weekly study schedule.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">
                <h4>Assignment Tracker</h4>
                <p>Never miss another submission deadline.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">
                <h4>Habit Tracker</h4>
                <p>Build consistent study habits with visual progress.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">
                <h4>Focus Mode</h4>
                <p>Stay distraction-free using Pomodoro sessions.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">
                <h4>Resource Library</h4>
                <p>Store PDFs, notes and learning materials in one place.</p>
              </div>
            </div>
          </div>

          <div className="auth-dashboard-preview">
            <div className="auth-dash-card">
              <div className="auth-dash-card-title">Today's Timetable</div>
              <div className="auth-dash-card-value">3 Lectures</div>
            </div>
            <div className="auth-dash-card">
              <div className="auth-dash-card-title">Study Streak</div>
              <div className="auth-dash-card-value">12 Days</div>
            </div>
            <div className="auth-dash-card">
              <div className="auth-dash-card-title">Pending Assignments</div>
              <div className="auth-dash-card-value">2 Due</div>
            </div>
            <div className="auth-dash-card">
              <div className="auth-dash-card-title">Focus Time</div>
              <div className="auth-dash-card-value">4.5 Hrs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="auth-form-panel">
        <Link to="/" className="mobile-back-link">
          <span>←</span> Back to Home
        </Link>
        <div className="auth-form-container">
          <div className="card auth-card">
            
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, background: "var(--primary)", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 28, fontWeight: 800, marginBottom: 16, boxShadow: "0 8px 24px rgba(214, 90, 49, 0.25)" }}>
                S
              </div>
              <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Welcome back</h1>
              <p style={{ margin: 0 }}>Sign in to continue to ScheduleX</p>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: 24, fontSize: "0.9rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                {error}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => googleLogin('login')}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: 20
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "var(--surface)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Or continue with email</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
            </div>

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
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Please reset your password through your registered email or contact support."); }} style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
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
                <label htmlFor="remember" style={{ fontSize: "0.9rem", cursor: "pointer", userSelect: "none" }}>Remember me for 30 days</label>
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

            <p style={{ textAlign: "center", marginTop: 32, fontSize: "0.95rem" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;