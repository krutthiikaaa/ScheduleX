import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="card" style={{ width: "400px", margin: "100px auto" }}>
      <h2>Register</h2>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button>Register</button>
      <p>
        Already have account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;