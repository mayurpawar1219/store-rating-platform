import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TextField from "../components/inputs/TextField";
import PasswordField from "../components/inputs/PasswordField";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(name, email, address, password);
      setSuccess("Account registered successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="page page--auth">
      <div className="authCard" style={{ maxWidth: "480px" }}>
        <h1 className="authCard__title">Create Account</h1>
        <p className="authCard__subtitle">Register to rate, review, and search local stores</p>

        {error && (
          <div className="alert alert--error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert--success">
            {success}
          </div>
        )}

        <form className="form" onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={setName}
            required
          />

          <TextField
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={setEmail}
            required
          />

          <TextField
            label="Address"
            placeholder="City, State"
            value={address}
            onChange={setAddress}
            required
          />

          <PasswordField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
          />

          <button className="btn btn--primary" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div className="authCard__link">
            Already have an account? <Link to="/">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
