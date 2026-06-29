import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../utils/api";
import "../styles/auth.css";

function Register() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", terms: false });

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
      setError("Password must be at least 6 characters.");
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
      const data = await registerUser({ fullName: formData.name, email: formData.email, password: formData.password });
      login(data.token, data.user);
    } catch (err) {
      setError(err.message || "Failed to create account.");
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
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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