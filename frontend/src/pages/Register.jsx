import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Register() {
  const { register, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", terms: false });

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Enter password", color: "var(--text-muted)" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "#EF4444" };
    if (score === 2) return { score: 2, label: "Medium", color: "#F59E0B" };
    if (score === 3) return { score: 3, label: "Strong", color: "#10B981" };
    return { score: 4, label: "Very Strong", color: "#059669" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.terms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
    } catch (err) {
      setError(err.message || "Failed to create account. Email may already exist.");
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
              <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Create an account</h1>
              <p style={{ margin: 0 }}>Join ScheduleX to manage your studies</p>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: 24, fontSize: "0.9rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                {error}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => googleLogin('register')}
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
              Sign up with Google
            </button>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Or register with email</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
            </div>

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", fontWeight: 600 }}>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

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
                  {formData.password && (
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: strength.color }}>
                      Strength: {strength.label}
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password (min 6 chars)"
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
                {/* Password strength bar */}
                {formData.password && (
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: step <= strength.score ? strength.color : "var(--border)",
                          transition: "background 0.3s ease"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={formData.terms}
                  onChange={e => setFormData({...formData, terms: e.target.checked})}
                  style={{ width: 16, height: 16, accentColor: "var(--primary)", marginTop: 4 }} 
                />
                <label htmlFor="terms" style={{ fontSize: "0.85rem", cursor: "pointer", userSelect: "none", lineHeight: 1.5 }}>
                  I agree to the <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Terms of Service</a> and <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Privacy Policy</a>.
                </label>
              </div>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: 16, fontSize: "1rem", marginTop: 8 }}
              >
                {loading ? "Creating account..." : "Get Started"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 32, fontSize: "0.95rem" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;