import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="card" style={{ width: "400px", margin: "100px auto" }}>
      <h2>Login</h2>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don’t have account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;