import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TextField from "../components/inputs/TextField";
import PasswordField from "../components/inputs/PasswordField";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await loginUser(email, password);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        navigate("/owner");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--auth">
      <div className="authCard">
        <h1 className="authCard__title">Welcome Back</h1>
        <p className="authCard__subtitle">Sign in to manage and review local stores</p>
        
        {error && (
          <div className="alert alert--error">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={setEmail}
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
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="authCard__link">
            Don't have an account yet? <Link to="/register">Create free account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
