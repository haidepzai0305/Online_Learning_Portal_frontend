import { useState } from "react";
import axios from "axios";

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
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "5px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "11px 14px",
            paddingRight: rightEl ? "42px" : "14px",
            border: `1px solid ${error ? "#f87171" : focused ? "#3b82f6" : "#e2e8f0"}`,
            borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none",
            fontFamily: "inherit", background: "#fff", transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
          }}
        />
        {rightEl && (
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>{rightEl}</span>
        )}
      </div>
      {error && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px",
        background: hover ? "#f8fafc" : "#fff", cursor: "pointer",
        fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: "inherit", transition: "background 0.15s",
      }}>
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
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <SocialBtn icon={<IconGoogle />} label="Continue with Google" />
        <SocialBtn icon={<IconFacebook />} label="Continue with Facebook" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>

      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <TextInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••"
        rightEl={
          <button type="button" onClick={() => setShowPw(p => !p)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
            <IconEye show={showPw} />
          </button>
        }
      />

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#374151" }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            style={{ width: "15px", height: "15px", accentColor: "#3b82f6", cursor: "pointer" }} />
          Remember me
        </label>
        <a href="#" style={{ fontSize: "13px", color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
      </div>

      <button type="submit" disabled={loading} style={{
        width: "100%", padding: "12px", borderRadius: "8px", border: "none",
        background: loading ? "#93c5fd" : "#3b82f6", color: "#fff",
        fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", transition: "background 0.2s",
      }}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#64748b" }}>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: 600, fontSize: "13px", padding: 0, fontFamily: "inherit" }}>
          Sign up
        </button>
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
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 style={{ color: "#1e293b", margin: "0 0 8px", fontSize: "18px", fontWeight: 600 }}>Account created!</h3>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px" }}>Your account is ready. Sign in to get started.</p>
        <button onClick={onSwitch} style={{ padding: "11px 32px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Sign in now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput label="Full name" value={fullName} onChange={setFullName} placeholder="Nguyen Van A" error={errors.fullName} />
      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email} />
      <TextInput label="Username" value={username} onChange={setUsername} placeholder="username" error={errors.username} />
      <TextInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} placeholder="Min. 6 characters" error={errors.password}
        rightEl={
          <button type="button" onClick={() => setShowPw(p => !p)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
            <IconEye show={showPw} />
          </button>
        }
      />
      <TextInput label="Confirm password" type={showPw ? "text" : "password"} value={password2} onChange={setPassword2} placeholder="Re-enter password" error={errors.password2} />

      <div style={{ marginBottom: "18px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Role</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {(["student", "professor"] as Role[]).map(r => (
            <button key={r} type="button" onClick={() => setRole(r)} style={{
              padding: "9px", borderRadius: "8px",
              border: `1.5px solid ${role === r ? "#3b82f6" : "#e2e8f0"}`,
              background: role === r ? "#eff6ff" : "#fff",
              color: role === r ? "#2563eb" : "#64748b",
              fontWeight: 500, fontSize: "13px", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
            }}>
              {r === "student" ? "Student" : "Professor"}
            </button>
          ))}
        </div>
      </div>

      {errors.non_field_errors && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#ef4444" }}>
          {errors.non_field_errors}
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        width: "100%", padding: "12px", borderRadius: "8px", border: "none",
        background: loading ? "#93c5fd" : "#3b82f6", color: "#fff",
        fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", transition: "background 0.2s",
      }}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#64748b" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: 600, fontSize: "13px", padding: 0, fontFamily: "inherit" }}>
          Sign in
        </button>
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
    <div style={{ flex: 1, background: "#f0f7ff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>
      <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#0f172a", margin: "0 0 14px", lineHeight: 1.2 }}>
        Learn smarter<br />with AI
      </h2>
      <p style={{ fontSize: "15px", color: "#475569", margin: "0 0 36px 50px", lineHeight: 1.7, maxWidth: "340px" }}>
        Online learning Portal brings your courses to life with intelligent study tools, seamless assignment tracking, and real-time progress insights.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#dbeafe", border: "2px solid #93c5fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{f.title}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#fff" }}>
      <div style={{ width: "480px", minWidth: "380px", padding: "48px 52px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ marginBottom: "36px" }}>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", fontStyle: "italic" }}>Online Learning Portal</span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
          {tab === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 28px" }}>
          {tab === "login" ? "Enter your credentials to access your account" : "Fill in the details below to get started"}
        </p>
        {tab === "login" ? <LoginForm onSwitch={() => setTab("register")} /> : <RegisterForm onSwitch={() => setTab("login")} />}
      </div>
      <RightPanel />
    </div>
  );
}