import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    }, 2400);
    return () => clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className="splash-screen fade-out">
        <div className="splash-content">
          <div className="splash-logo-wrap">
            <div className="splash-logo">S</div>
          </div>
          <h1 className="splash-title">ScheduleX</h1>
          <p className="splash-tagline">The Minimalist Student Workspace</p>
          <div className="splash-loader">
            <div className="splash-loader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text-heading)", fontFamily: "var(--font)", width: "100%", overflowX: "hidden" }}>
      
      {/* Navbar */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-light)",
        width: "100%"
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "16px 40px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text-heading)", fontWeight: 800, fontSize: "1.2rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--primary)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
              S
            </div>
            ScheduleX
          </Link>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 24, fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <a href="#features" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>Features</a>
              <a href="#workflow" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>Workflow</a>
              <a href="#advantages" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>Why ScheduleX</a>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ maxWidth: 1360, margin: "0 auto", padding: "72px 40px 88px", boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>
            Academic OS
          </div>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 20, color: "var(--text-heading)" }}>
            Master Your Academic Schedule.
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--text-body)", marginBottom: 32, maxWidth: 540 }}>
            The minimalist workspace built for high-performing students. Manage weekly lectures, track assignments, build study habits, and execute deep work without distraction.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>Access Workspace</Link>
          </div>
        </div>

        {/* Crisp Interactive Hero UI Card */}
        <div style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)" }}>Good Morning, Alex</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Computer Science • Semester 5</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: "var(--success-light)", color: "var(--success)", fontWeight: 700, fontSize: "0.75rem" }}>
              Focus Mode Ready
            </div>
          </div>

          {/* Mini Stat Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-secondary)", borderLeft: "3px solid var(--primary)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Study Streak</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: 4 }}>14 Days</div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-secondary)", borderLeft: "3px solid var(--warning)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Pending Tasks</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: 4 }}>3 Items</div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-secondary)", borderLeft: "3px solid var(--info)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Weekly Focus</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: 4 }}>18.5 hrs</div>
            </div>
          </div>

          {/* Live Schedule Banner */}
          <div style={{ padding: 18, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card-bg)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Next Up • 10:00 AM</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: 2 }}>Operating Systems Lecture</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room 304 • Prof. Davis</div>
          </div>
        </div>
      </header>

      {/* Features Grid Section */}
      <section id="features" style={{ background: "var(--bg-secondary)", padding: "80px 0", width: "100%", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>Built for Clarity & Focus</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>
              Every core utility integrated into one balanced workspace. Say goodbye to scattered spreadsheets and disconnected apps.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {[
              { title: "Conflict-Free Timetable", desc: "Organize weekly recurring lectures, labs, and tutorials with intelligent conflict detection and clean room mapping." },
              { title: "Assignment & Deadline Tracker", desc: "Prioritize coursework with automated urgency alerts and structured submission tracking across all enrolled subjects." },
              { title: "Pomodoro Focus Mode", desc: "Execute deep study sprints using customizable focus intervals seamlessly integrated with your academic task list." },
              { title: "Habit & Goal Engine", desc: "Establish consistent daily routines and track weekly academic targets with visual progression bars." },
              { title: "Academic Library", desc: "Centralize course syllabi, lecture notes, video recordings, and study guides tagged by subject for instant retrieval." },
              { title: "Productivity Pulse", desc: "Gain actionable feedback on your study habits through detailed metrics on focus duration and streak consistency." }
            ].map((feature, idx) => (
              <div key={idx} className="card hover-card" style={{ padding: 28, display: "flex", flexDirection: "column", justify: "space-between", borderTop: "3px solid var(--primary)", boxSizing: "border-box" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 10, color: "var(--text-heading)" }}>{feature.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" style={{ padding: "80px 0", width: "100%" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>A Streamlined Workflow</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>
              Three simple steps to transform your semester management.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {[
              { step: "01", title: "Map Your Semester", desc: "Input your subjects, lecture timetable, and recurring weekly commitments." },
              { step: "02", title: "Centralize Deadlines", desc: "Log assignments, exams, and project milestones to generate your priority dashboard." },
              { step: "03", title: "Execute with Focus", desc: "Use focus mode and daily habit checklists to consistently hit your academic goals." }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 32, position: "relative", boxSizing: "border-box" }}>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary)", opacity: 0.2, marginBottom: 12 }}>{item.step}</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ScheduleX */}
      <section id="advantages" style={{ background: "var(--bg-secondary)", padding: "80px 0", width: "100%", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 48 }}>
          <div style={{ flex: "1 1 440px" }}>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 16 }}>Why High Performers Choose ScheduleX</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 28 }}>
              Most student tools are either overly complex project managers or overly basic to-do lists. ScheduleX strikes the exact balance required for academic success without cognitive overload.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>Create Your Free Account</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, flex: "1 1 480px" }}>
            {[
              { title: "Zero Clutter", desc: "Minimalist UI that keeps your focus purely on execution." },
              { title: "Instant Sync", desc: "All changes immediately reflect across your dashboard." },
              { title: "Privacy First", desc: "Your personal academic data remains completely private." },
              { title: "Light & Dark Mode", desc: "Tailored visual themes for day and late-night study." }
            ].map((adv, idx) => (
              <div key={idx} className="card" style={{ padding: 24, boxSizing: "border-box" }}>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 6, color: "var(--text-heading)" }}>{adv.title}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{adv.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 0", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", width: "100%" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text-heading)" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--primary)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>S</div>
            ScheduleX
          </div>
          <div>© {new Date().getFullYear()} ScheduleX Workspace. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
