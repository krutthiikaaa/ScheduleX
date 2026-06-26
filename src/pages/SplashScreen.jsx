import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/landing"), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo">S</div>
        </div>
        <h1 className="splash-title">ScheduleX</h1>
        <p className="splash-tagline">Plan Smarter. Achieve More.</p>
        <div className="splash-loader">
          <div className="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
