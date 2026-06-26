import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function LandingPage() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    sectionsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  const features = [
    { icon: "📋", title: "Smart Schedule Management", desc: "Create, edit, and organize timetables effortlessly with an intuitive drag-and-drop interface." },
    { icon: "📊", title: "Productivity Analytics", desc: "Track study hours, completion rates, and productivity trends with beautiful visual insights." },
    { icon: "🏷️", title: "Multiple Categories", desc: "Organize schedules by department, semester, or custom categories with color-coded tags." },
    { icon: "📱", title: "Responsive Experience", desc: "Access your schedules from any device with a seamlessly adaptive, premium interface." },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up in seconds and set up your workspace." },
    { num: "02", title: "Build Your Schedule", desc: "Add subjects, assign time slots, and organize your week." },
    { num: "03", title: "Track Productivity", desc: "Monitor progress and optimize your routine with analytics." },
  ];

  const whyCards = [
    { icon: "⚡", title: "Fast & Easy", desc: "Get started in under a minute." },
    { icon: "✨", title: "Clean Interface", desc: "Minimal, distraction-free design." },
    { icon: "🔒", title: "Secure", desc: "Your data stays private and protected." },
    { icon: "📈", title: "Productivity Analytics", desc: "Visual insights to boost performance." },
    { icon: "🎨", title: "Custom Timetables", desc: "Fully personalized schedule layouts." },
    { icon: "🧠", title: "Smart Organization", desc: "AI-ready structure for the future." },
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-nav-brand">
            <span className="landing-nav-logo">S</span>
            <span>ScheduleX</span>
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
      <section className="landing-hero">
        <div className="hero-content" ref={addRef}>
          <div className="hero-text">
            <h1>Organize Every Hour.<br />Simplify Every Day.</h1>
            <p>ScheduleX is the modern scheduling platform built for students, professionals, universities, and organizations. Create beautiful timetables, track productivity, and take control of your time.</p>
            <div className="hero-btns">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </div>
          </div>
          <div className="hero-mockup">
            <div className="mockup-window">
              <div className="mockup-topbar">
                <span className="mockup-dot red"></span>
                <span className="mockup-dot yellow"></span>
                <span className="mockup-dot green"></span>
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar-mini">
                  <div className="m-item active"></div>
                  <div className="m-item"></div>
                  <div className="m-item"></div>
                </div>
                <div className="mockup-main">
                  <div className="m-header"></div>
                  <div className="m-cards">
                    <div className="m-card terracotta"></div>
                    <div className="m-card sage"></div>
                    <div className="m-card clay"></div>
                  </div>
                  <div className="m-table">
                    <div className="m-row"></div>
                    <div className="m-row"></div>
                    <div className="m-row"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features" ref={addRef}>
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2>Everything You Need to Stay Organized</h2>
          <p>Powerful tools designed with simplicity at their core.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="landing-section bg-stone" id="about" ref={addRef}>
        <div className="section-header">
          <span className="section-badge">Preview</span>
          <h2>A Dashboard You'll Love Using</h2>
          <p>See your entire week at a glance with smart cards, analytics, and calendar views.</p>
        </div>
        <div className="preview-grid">
          {["Schedule Cards", "Calendar View", "Analytics", "Smart Organization"].map((t, i) => (
            <div className="preview-card" key={t}>
              <div className={`preview-visual v${i}`}></div>
              <h3>{t}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" ref={addRef}>
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2>Three Simple Steps</h2>
        </div>
        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-arrow">↓</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Why ScheduleX */}
      <section className="landing-section bg-stone" ref={addRef}>
        <div className="section-header">
          <span className="section-badge">Why ScheduleX</span>
          <h2>Built for the Way You Work</h2>
        </div>
        <div className="why-grid">
          {whyCards.map((c) => (
            <div className="why-card" key={c.title}>
              <span className="why-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" ref={addRef}>
        <h2>Ready to Organize Your Time Better?</h2>
        <p>Join thousands of students and professionals who trust ScheduleX.</p>
        <div className="hero-btns">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="contact">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="landing-nav-logo">S</span>
            <span className="footer-title">ScheduleX</span>
            <p>Plan Smarter. Achieve More.</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="https://github.com/krutthiikaaa/ScheduleX" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms &amp; Conditions</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ScheduleX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
