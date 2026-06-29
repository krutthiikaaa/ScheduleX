import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const [showSplash, setShowSplash] = useState(() => {
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "back_forward") {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    if (showSplash) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.landing-section, .hero-content, .landing-cta').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className={`splash-screen fade-out`}>
        <div className="splash-content">
          <div className="splash-logo-wrap">
            <div className="splash-logo">S</div>
          </div>
          <h1 className="splash-title">ScheduleX</h1>
          <p className="splash-tagline">Your Personal Student Productivity Workspace</p>
          <div className="splash-loader">
            <div className="splash-loader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" style={{ overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-nav-brand">
            <div className="landing-nav-logo">S</div>
            ScheduleX
          </Link>

        </div>
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Organize Your Entire Academic Life in One Place.</h1>
            <p>ScheduleX helps students manage their timetable, assignments, study sessions, resources, goals, and productivity through one organized workspace.</p>
            <div className="hero-btns">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mockup-window">
              <div className="mockup-topbar">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar-mini" style={{ width: "60px", background: "var(--sidebar-bg)" }}>
                  <div className="m-item active" style={{ background: "var(--primary)" }}></div>
                  <div className="m-item" style={{ background: "rgba(255,255,255,0.1)" }}></div>
                  <div className="m-item" style={{ background: "rgba(255,255,255,0.1)" }}></div>
                </div>
                <div className="mockup-main">
                  <div className="m-header" style={{ width: "40%" }}></div>
                  <div className="m-cards">
                    <div className="m-card terracotta" style={{ background: "var(--primary-light)" }}></div>
                    <div className="m-card sage" style={{ background: "var(--success-light)" }}></div>
                    <div className="m-card clay" style={{ background: "var(--info-light)" }}></div>
                  </div>
                  <div className="m-table">
                    <div className="m-row" style={{ width: "100%" }}></div>
                    <div className="m-row" style={{ width: "80%" }}></div>
                    <div className="m-row" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="landing-section bg-stone">
        <div className="section-header">
          <span className="section-badge" style={{ color: "var(--primary)", background: "var(--primary-light)" }}>Workspace</span>
          <h2>Everything You Need</h2>
          <p>Powerful tools designed with simplicity at their core.</p>
        </div>
        <div className="features-grid">
          {[
            { title: "Smart Timetable Management", desc: "Conflict-free weekly planner.", icon: "" },
            { title: "Assignment Tracker", desc: "Never miss a deadline.", icon: "" },
            { title: "Resource Library", desc: "Cloud storage for materials.", icon: "" },
            { title: "Study Planner", desc: "Dedicated spaces per subject.", icon: "" },
            { title: "Pomodoro Focus Mode", desc: "Track deep work sessions.", icon: "" },
            { title: "Tasks & Goals", desc: "Daily and weekly checklists.", icon: "" },
            { title: "Productivity Analytics", desc: "Deep insights into study habits.", icon: "" },
            { title: "Study Streak", desc: "Build consistent habits.", icon: "" }
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="landing-section">
        <div className="section-header">
          <span className="section-badge" style={{ color: "var(--primary)", background: "var(--primary-light)" }}>Workflow</span>
          <h2>How It Works</h2>
        </div>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Create Account</h3>
            <p>Sign up securely.</p>
            <div className="step-arrow">→</div>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Build Your Timetable</h3>
            <p>Add subjects & schedule.</p>
            <div className="step-arrow">→</div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Plan Your Study Sessions</h3>
            <p>Track tasks & notes.</p>
            <div className="step-arrow">→</div>
          </div>
          <div className="step-card">
            <div className="step-num">4</div>
            <h3>Stay Productive</h3>
            <p>Watch your stats grow.</p>
          </div>
        </div>
      </section>

      {/* Why Choose ScheduleX */}
      <section className="landing-section bg-stone">
        <div className="section-header">
          <span className="section-badge" style={{ color: "var(--primary)", background: "var(--primary-light)" }}>Benefits</span>
          <h2>Why Choose ScheduleX</h2>
        </div>
        <div className="features-grid">
          {[
            { title: "Everything in One Place", desc: "No more switching between apps." },
            { title: "Built for Students", desc: "Designed for academic needs." },
            { title: "Simple & Modern Interface", desc: "Beautiful, distraction-free UI." },
            { title: "Track Productivity", desc: "Visual charts for your progress." },
            { title: "Stay Organized", desc: "Manage everything flawlessly." },
            { title: "Improve Study Habits", desc: "Build streaks and reach goals." },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ textAlign: "center" }}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Start Organizing Smarter Today</h2>
        <p>Join thousands of students organizing their semesters with ScheduleX.</p>
        <div className="hero-btns">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
