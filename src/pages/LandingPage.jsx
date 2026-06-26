import { useEffect } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  useEffect(() => {
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
  }, []);

  return (
    <div className="app-shell" style={{ overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-nav-brand">
            <div className="landing-nav-logo">S</div>
            ScheduleX
          </Link>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="nav-link-btn">Login</Link>
            <Link to="/register" className="nav-cta-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Organize Your Entire Academic Life in One Place.</h1>
            <p>Manage your timetable, assignments, notes, exams, goals and academic progress through one beautifully designed workspace.</p>
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
            { title: "Smart Timetable", desc: "Conflict-free weekly planner.", icon: "📅" },
            { title: "Assignment Management", desc: "Never miss a deadline.", icon: "📝" },
            { title: "Subject Workspace", desc: "Dedicated spaces per course.", icon: "📚" },
            { title: "Exam Planner", desc: "Countdowns and syllabus.", icon: "📆" },
            { title: "Notes & Resources", desc: "Cloud storage for materials.", icon: "📂" },
            { title: "Goal Tracking", desc: "Daily and weekly checklists.", icon: "🎯" },
            { title: "Analytics", desc: "Deep insights into study habits.", icon: "📈" }
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
            <h3>Build Your Semester</h3>
            <p>Add subjects & timetable.</p>
            <div className="step-arrow">→</div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Stay Organized</h3>
            <p>Track tasks & notes.</p>
            <div className="step-arrow">→</div>
          </div>
          <div className="step-card">
            <div className="step-num">4</div>
            <h3>Track Progress</h3>
            <p>Watch your GPA grow.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to take control of your academic life?</h2>
        <p>Join thousands of students organizing their semesters with ScheduleX.</p>
        <div className="hero-btns">
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-nav-logo">S</div>
            <span className="footer-title">ScheduleX</span>
            <p>The modern student productivity platform.</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#contact">Contact</a>
            <a href="#github">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ScheduleX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
