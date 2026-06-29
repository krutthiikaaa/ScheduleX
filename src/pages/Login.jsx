import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, googleAuth } from "../utils/api";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import "../styles/auth.css";

function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

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
      const data = await loginUser({ email: formData.email, password: formData.password });
      login(data.token, data.user);
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const data = await googleAuth({ email: user.email, fullName: user.displayName });
      login(data.token, data.user);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || "Google authentication failed.");
      }
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
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Forgot Password Flow"); }} style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
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

            <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }}></div>
              <div style={{ padding: "0 16px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>OR</div>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: 16,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                background: "#FFF",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: "var(--radius-btn, 16px)",
                color: "var(--text-heading)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#F8F8F7"}
              onMouseOut={(e) => e.currentTarget.style.background = "#FFF"}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>

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