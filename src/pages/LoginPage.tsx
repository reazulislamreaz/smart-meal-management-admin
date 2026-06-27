import { useState, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// Demo credentials
const DEMO_EMAIL = "admin@sizzl.com";
const DEMO_PASSWORD = "admin123";

interface Props {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    // Simulate a short network delay
    await new Promise((r) => setTimeout(r, 600));

    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      if (remember) localStorage.setItem("sizzl-auth", "1");
      else sessionStorage.setItem("sizzl-auth", "1");
      onLogin();
    } else {
      setError("Incorrect email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          sizzl<span>.</span>
        </div>

        {/* Heading */}
        <h1 className="login-heading">Welcome Back</h1>
        <p className="login-sub">Please Enter Your Details Below to Continue</p>

        {/* Error */}
        {error && <p className="login-error">{error}</p>}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <label className="login-field">
            <span className="login-field__icon">
              <Mail />
            </span>
            <div className="login-field__divider" />
            <input
              id="login-email"
              type="email"
              className="login-field__input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </label>

          {/* Password */}
          <label className="login-field">
            <span className="login-field__icon">
              <Lock />
            </span>
            <div className="login-field__divider" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="login-field__input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </label>

          {/* Remember me row */}
          <div className="login-remember-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="login-remember__check"
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`login-submit${loading ? " login-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        {/* Demo hint */}
        <p className="login-hint">
          Demo — email: <strong>{DEMO_EMAIL}</strong> &nbsp;|&nbsp; password:{" "}
          <strong>{DEMO_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
