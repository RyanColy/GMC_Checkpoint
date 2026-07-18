import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const RegisterForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: "", handle: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create your NexTalk account</h2>

      {error && <p className="auth-form__error">{error}</p>}

      <label>
        Display name
        <input name="displayName" value={form.displayName} onChange={handleChange} required />
      </label>

      <label>
        Handle <span className="auth-form__hint">(@username, 3-30 chars)</span>
        <input
          name="handle"
          value={form.handle}
          onChange={handleChange}
          pattern="^[a-zA-Z0-9_.]{3,30}$"
          required
        />
      </label>

      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Password <span className="auth-form__hint">(min 6 characters)</span>
        <input name="password" type="password" value={form.password} onChange={handleChange} minLength={6} required />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
