import { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const API_BASE = "http://localhost:8000/api";

type Role = "student" | "professor";
type Tab = "login" | "register";

async function loginRequest(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/token/`, { username: email, password });
  return res.data;
}

async function registerRequest(data: {
  username: string; email: string; password: string;
  password2: string; role: Role; full_name: string;
}) {
  const res = await axios.post(`${API_BASE}/auth/register/`, data);
  return res.data;
}

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function IconEye({ show }: { show: boolean }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function TextInput({ label, type = "text", value, onChange, placeholder, error, rightEl }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; rightEl?: React.ReactNode;
}) {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <div className="input-container">
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${error ? "error" : ""} ${rightEl ? "has-right" : ""}`}
        />
        {rightEl && <span className="input-right-el">{rightEl}</span>}
      </div>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" className="social-btn">
      {icon}{label}
    </button>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const data = await loginRequest(email, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", data.role ?? "student");
      if (remember) localStorage.setItem("remember_user", email);
      window.location.href = (data.role ?? "student") === "professor" ? "/manage-courses" : "/dashboard";
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Incorrect username or password.");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="social-row">
        <SocialBtn icon={<IconGoogle />} label="Continue with Google" />
        <SocialBtn icon={<IconFacebook />} label="Continue with Facebook" />
      </div>

      <div className="or-divider">
        <div className="or-divider-line" />
        <span className="or-divider-text">OR</span>
        <div className="or-divider-line" />
      </div>

      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <TextInput
        label="Password" type={showPw ? "text" : "password"}
        value={password} onChange={setPassword} placeholder="••••••••"
        rightEl={
          <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
            <IconEye show={showPw} />
          </button>
        }
      />

      {error && <div className="error-alert">{error}</div>}

      <div className="remember-row">
        <label className="remember-label">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="remember-checkbox" />
          Remember me
        </label>
        <a href="#" className="forgot-link">Forgot password?</a>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="switch-text">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="switch-btn">Sign up</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Please enter your full name.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email address.";
    if (username.length < 3) e.username = "Min. 3 characters.";
    if (password.length < 6) e.password = "Min. 6 characters.";
    if (password !== password2) e.password2 = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setErrors({});
    try {
      await registerRequest({ username, email, password, password2, role, full_name: fullName });
      setSuccess(true);
    } catch (err: any) {
      const data = err?.response?.data ?? {};
      const mapped: Record<string, string> = {};
      Object.entries(data).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] as string : String(v); });
      setErrors(mapped);
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="success-wrap">
        <div className="success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="success-title">Account created!</h3>
        <p className="success-desc">Your account is ready. Sign in to get started.</p>
        <button onClick={onSwitch} className="success-btn">Sign in now</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput label="Full name" value={fullName} onChange={setFullName} placeholder="Nguyen Van A" error={errors.fullName} />
      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email} />
      <TextInput label="Username" value={username} onChange={setUsername} placeholder="username" error={errors.username} />
      <TextInput
        label="Password" type={showPw ? "text" : "password"}
        value={password} onChange={setPassword} placeholder="Min. 6 characters" error={errors.password}
        rightEl={
          <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
            <IconEye show={showPw} />
          </button>
        }
      />
      <TextInput label="Confirm password" type={showPw ? "text" : "password"} value={password2} onChange={setPassword2} placeholder="Re-enter password" error={errors.password2} />

      <div>
        <label className="role-label">Role</label>
        <div className="role-grid">
          {(["student", "professor"] as Role[]).map(r => (
            <button key={r} type="button" onClick={() => setRole(r)} className={`role-btn ${role === r ? "active" : ""}`}>
              {r === "student" ? "Student" : "Professor"}
            </button>
          ))}
        </div>
      </div>

      {errors.non_field_errors && <div className="error-alert">{errors.non_field_errors}</div>}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="switch-text">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="switch-btn">Sign in</button>
      </p>
    </form>
  );
}

function RightPanel() {
  const features = [
    { title: "AI Study Assistant", desc: "Get instant explanations and summaries" },
    { title: "Track Progress", desc: "Monitor your learning journey in real-time" },
    { title: "Collaborate", desc: "Connect with students and professors" },
  ];
  return (
    <div className="right-panel">
      <div className="right-panel-content">
        <div className="right-panel-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <h2 className="right-panel-title">Learn smarter<br />with AI</h2>
        <p className="right-panel-desc">
          Online learning Portal brings your courses to life with intelligent study tools, seamless assignment tracking, and real-time progress insights.
        </p>
        <div className="feature-list">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">Online Learning Portal</div>
        <h1 className="auth-title">
          {tab === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="auth-subtitle">
          {tab === "login" ? "Enter your credentials to access your account" : "Fill in the details below to get started"}
        </p>
        {tab === "login"
          ? <LoginForm onSwitch={() => setTab("register")} />
          : <RegisterForm onSwitch={() => setTab("login")} />
        }
      </div>
      <div className="auth-right">
        <RightPanel />
      </div>
    </div>
  );
}