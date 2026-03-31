import { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const API_BASE = "http://localhost:8000/api";

type Tab = "login" | "register";

async function loginRequest(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/token/`, { username: email, password });
  return res.data;
}

async function registerRequest(data: {
  username: string; email: string; password: string;
  password2: string; role: string; full_name: string;
}) {
  const res = await axios.post(`${API_BASE}/auth/register/`, data);
  return res.data;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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

function IconMicrosoft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
      <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
      <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
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

// ─── Text Input ───────────────────────────────────────────────────────────────
function TextInput({ label, type = "text", value, onChange, placeholder, error, rightEl, children }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; rightEl?: React.ReactNode; children?: React.ReactNode;
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
      {children}
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}

// ─── Password Requirements ────────────────────────────────────────────────────
function PasswordRequirements({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Starts with uppercase letter", ok: /^[A-Z]/.test(password) },
    { label: "Contains letters and numbers", ok: /[a-zA-Z]/.test(password) && /[0-9]/.test(password) },
    { label: "Contains a special character", ok: /[^a-zA-Z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="pw-requirements">
      {rules.map((r, i) => (
        <div key={i} className={`pw-rule ${r.ok ? "ok" : "fail"}`}>
          <span className="pw-rule-icon">{r.ok ? "✓" : "○"}</span>
          <span>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Email Format Hint ────────────────────────────────────────────────────────
function EmailHint({ email }: { email: string }) {
  if (!email) return null;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className={`email-hint ${valid ? "ok" : "fail"}`}>
      <span className="pw-rule-icon">{valid ? "✓" : "○"}</span>
      <span>{valid ? "Valid email format" : "Enter a valid email (e.g. you@example.com)"}</span>
    </div>
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" className="social-btn">
      {icon}{label}
    </button>
  );
}

// ─── Terms Modal ──────────────────────────────────────────────────────────────
function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Terms of Service</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h3>1. Acceptance of Terms</h3>
          <p>By creating an account on Online Learning Portal, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

          <h3>2. Account Registration</h3>
          <p>You must provide accurate and complete information when registering. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h3>3. Acceptable Use</h3>
          <p>You agree to use the platform only for lawful purposes. You must not share, copy, or distribute any course content without permission. You must not impersonate other users or instructors.</p>

          <h3>4. Intellectual Property</h3>
          <p>All course content, materials, and resources on this platform are the intellectual property of Online Learning Portal or its instructors. Unauthorized use is strictly prohibited.</p>

          <h3>5. Privacy Policy</h3>
          <p>Your personal data will be handled in accordance with our Privacy Policy. We collect data such as your name, email, and learning activity to improve your experience.</p>

          <h3>6. Termination</h3>
          <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>

          <h3>7. Changes to Terms</h3>
          <p>We may update these terms from time to time. Continued use of the platform after changes constitutes your acceptance of the new terms.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-accept-btn" onClick={onClose}>I Understand</button>
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
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
        <SocialBtn icon={<IconMicrosoft />} label="Continue with Microsoft" />
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

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const pwValid = {
    length: password.length >= 8,
    uppercase: /^[A-Z]/.test(password),
    alphanumeric: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };
  const passwordOk = Object.values(pwValid).every(Boolean);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Please enter your full name.";
    if (!emailOk) e.email = "Invalid email address.";
    if (username.length < 3) e.username = "Min. 3 characters.";
    if (!passwordOk) e.password = "Password does not meet all requirements.";
    if (password !== password2) e.password2 = "Passwords do not match.";
    if (!agreedToTerms) e.terms = "You must agree to the Terms of Service.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setErrors({});
    try {
      await registerRequest({ username, email, password, password2, role: "student", full_name: fullName });
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
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <form onSubmit={handleSubmit} noValidate>
        <TextInput label="Full name" value={fullName} onChange={setFullName} placeholder="Nguyen Van A" error={errors.fullName} />

        <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email}>
          <EmailHint email={email} />
        </TextInput>

        <TextInput label="Username" value={username} onChange={setUsername} placeholder="username" error={errors.username} />

        <TextInput
          label="Password" type={showPw ? "text" : "password"}
          value={password} onChange={setPassword} placeholder="Min. 8 characters" error={errors.password}
          rightEl={
            <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
              <IconEye show={showPw} />
            </button>
          }
        >
          <PasswordRequirements password={password} />
        </TextInput>

        <TextInput
          label="Confirm password" type={showPw ? "text" : "password"}
          value={password2} onChange={setPassword2} placeholder="Re-enter password" error={errors.password2}
        />

        {/* Terms checkbox */}
        <div className="terms-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="remember-checkbox"
            />
            I agree to the{" "}
            <button
              type="button"
              className="terms-link"
              onClick={() => setShowTerms(true)}
            >
              Terms of Service
            </button>
          </label>
          {errors.terms && <p className="input-error-msg">{errors.terms}</p>}
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
    </>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────
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

// ─── Auth Page ────────────────────────────────────────────────────────────────
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