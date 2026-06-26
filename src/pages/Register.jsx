import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">S</div>
          <h1>ScheduleX</h1>
          <p>Create your scheduling workspace</p>
        </div>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              className="form-input"
              placeholder="Jane Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              placeholder="you@university.edu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              placeholder="Choose a strong password"
            />
          </div>

          <button
            id="register-submit"
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? (
              <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;