import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/landing");
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`splash-screen ${!loading ? "fade-out" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo">S</div>
        </div>
        <h1 className="splash-title">ScheduleX</h1>
        <p className="splash-tagline">Your Complete Student Productivity Workspace</p>
        <div className="splash-loader">
          <div className="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
