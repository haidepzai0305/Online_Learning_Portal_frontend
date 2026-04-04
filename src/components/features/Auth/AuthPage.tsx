import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import "./AuthPage.css";
import {
  fetchCurrentUser,
  getAccessToken,
  getUserDisplayName,
  getUserRole,
  loginRequest,
  registerRequest,
  type UserRole,
} from "../../../services/authService";
const PASSWORD_SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

type Tab = "login" | "register";
type PopupTone = "success" | "error";

interface PopupState {
  tone: PopupTone;
  title: string;
  message: string;
}

interface AuthPageProps {
  onLoginSuccess?: (name: string) => void;
}

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function IconMicrosoft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function IconEye({ show }: { show: boolean }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  rightEl,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rightEl?: ReactNode;
}) {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <div className="input-container">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${error ? "error" : ""} ${rightEl ? "has-right" : ""}`}
        />
        {rightEl ? <span className="input-right-el">{rightEl}</span> : null}
      </div>
      {error ? <p className="input-error-msg">{error}</p> : null}
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button type="button" className="social-btn">
      {icon}
      {label}
    </button>
  );
}

function StatusPopup({
  popup,
  onClose,
}: {
  popup: PopupState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!popup) {
      return;
    }

    const timer = window.setTimeout(onClose, 2400);
    return () => window.clearTimeout(timer);
  }, [popup, onClose]);

  if (!popup) {
    return null;
  }

  return (
    <div className={`status-popup ${popup.tone === "success" ? "success" : "error"}`} role="alert">
      <div className="status-popup-title">{popup.title}</div>
      <p className="status-popup-message">{popup.message}</p>
      <button type="button" className="status-popup-close" onClick={onClose}>
        x
      </button>
    </div>
  );
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Dieu khoan nguoi dung</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="modal-body">
          <h3>1. Tai khoan</h3>
          <p>Ban chiu trach nhiem ve do chinh xac cua thong tin dang ky va bao mat thong tin dang nhap cua minh.</p>
          <h3>2. Su dung nen tang</h3>
          <p>Khong su dung he thong cho muc dich gian lan, phat tan noi dung vi pham phap luat hoac xam pham quyen loi cua nguoi khac.</p>
          <h3>3. Noi dung hoc tap</h3>
          <p>Du lieu khoa hoc, tai lieu va tien do hoc tap co the duoc cap nhat de phuc vu trai nghiem hoc tap tot hon.</p>
          <h3>4. Quyen rieng tu</h3>
          <p>Thong tin ca nhan duoc xu ly de ho tro dang nhap, quan ly hoc tap va ca nhan hoa trai nghiem theo chinh sach cua he thong.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-accept-btn" onClick={onClose}>
            Da hieu
          </button>
        </div>
      </div>
    </div>
  );
}

function getPasswordChecks(password: string) {
  return [
    { label: "Toi thieu 6 ky tu", passed: password.length >= 6 },
    { label: "Co it nhat 1 chu viet hoa", passed: /[A-Z]/.test(password) },
    { label: "Co chu va so", passed: /[A-Za-z]/.test(password) && /\d/.test(password) },
    { label: "Co 1 ky tu dac biet", passed: PASSWORD_SPECIAL_CHAR_REGEX.test(password) },
  ];
}

function LoginForm({
  onSwitch,
  onLoginSuccess,
  showPopup,
}: {
  onSwitch: () => void;
  onLoginSuccess?: (name: string) => void;
  showPopup: (popup: PopupState) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      const message = "Please fill in all fields.";
      setError(message);
      showPopup({ tone: "error", title: "Dang nhap that bai", message });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginRequest(email, password);
      const accessToken = getAccessToken(data);
      if (!accessToken) {
        throw new Error("Backend login response does not contain an access token.");
      }

      localStorage.setItem("access_token", accessToken);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      } else {
        localStorage.removeItem("refresh_token");
      }

      let currentUser;
      try {
        currentUser = await fetchCurrentUser();
      } catch {
        currentUser = undefined;
      }

      const role = getUserRole(data, currentUser);
      const displayName = getUserDisplayName(data, email, currentUser);

      localStorage.setItem("user_role", role);
      if (remember) {
        localStorage.setItem("remember_user", email);
      }
      onLoginSuccess?.(displayName);
      showPopup({
        tone: "success",
        title: "Dang nhap thanh cong",
        message: "Thong tin tai khoan hop le. Dang chuyen huong...",
      });

      window.setTimeout(() => {
        window.location.href = role === "professor" ? "/manage-courses" : "/";
      }, 900);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message ??
        "Incorrect email or password.";
      setError(message);
      showPopup({ tone: "error", title: "Dang nhap that bai", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

      <TextInput
        label="Password"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        rightEl={
          <button type="button" className="eye-btn" onClick={() => setShowPw((current) => !current)}>
            <IconEye show={showPw} />
          </button>
        }
      />

      {error ? <div className="error-alert">{error}</div> : null}

      <div className="remember-row">
        <label className="remember-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="remember-checkbox"
          />
          Remember me
        </label>
        <a href="#" className="forgot-link">Forgot password?</a>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="or-divider" style={{ marginTop: "20px" }}>
        <div className="or-divider-line" />
        <span className="or-divider-text">OR</span>
        <div className="or-divider-line" />
      </div>

      <div className="social-row">
        <SocialBtn icon={<IconGoogle />} label="Continue with Google" />
        <SocialBtn icon={<IconMicrosoft />} label="Continue with Microsoft" />
      </div>

      <p className="switch-text">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="switch-btn">Sign up</button>
      </p>
    </form>
  );
}

function RegisterForm({
  onSwitch,
  showPopup,
  openTerms,
}: {
  onSwitch: () => void;
  showPopup: (popup: PopupState) => void;
  openTerms: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role] = useState<UserRole>("student");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const passwordChecks = getPasswordChecks(password);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nextErrors.email = "Invalid email address.";
    }
    if (username.length < 3) {
      nextErrors.username = "Min. 3 characters.";
    }
    if (!passwordChecks.every((rule) => rule.passed)) {
      nextErrors.password = "Password must match all required rules.";
    }
    if (password !== password2) {
      nextErrors.password2 = "Passwords do not match.";
    }
    if (!acceptedTerms) {
      nextErrors.terms = "You must accept the terms to continue.";
    }

    return nextErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showPopup({
        tone: "error",
        title: "Dang ky that bai",
        message: "Vui long kiem tra lai thong tin va dieu khoan nguoi dung.",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await registerRequest({ username, email, password, password2, role, full_name: fullName });
      showPopup({
        tone: "success",
        title: "Dang ky thanh cong",
        message: "Tai khoan da duoc tao. Ban co the dang nhap ngay bay gio.",
      });
      window.setTimeout(() => onSwitch(), 900);
    } catch (err: any) {
      const data = err?.response?.data ?? {};
      const mapped: Record<string, string> = {};
      Object.entries(data).forEach(([k, v]) => {
        mapped[k] = Array.isArray(v) ? (v[0] as string) : String(v);
      });
      setErrors(mapped);
      showPopup({
        tone: "error",
        title: "Dang ky that bai",
        message: mapped.non_field_errors ?? "Thong tin dang ky chua hop le.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput label="Full name" value={fullName} onChange={setFullName} placeholder="Nguyen Van A" error={errors.fullName} />
      <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email} />
      <TextInput label="Username" value={username} onChange={setUsername} placeholder="username" error={errors.username} />
      <TextInput
        label="Password"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
        error={errors.password}
        rightEl={
          <button type="button" className="eye-btn" onClick={() => setShowPw((current) => !current)}>
            <IconEye show={showPw} />
          </button>
        }
      />

      <div className="pw-requirements">
        {passwordChecks.map((rule) => (
          <div key={rule.label} className={`pw-rule ${rule.passed ? "ok" : "fail"}`}>
            <span className="pw-rule-icon">{rule.passed ? "✓" : "•"}</span>
            <span>{rule.label}</span>
          </div>
        ))}
      </div>

      <TextInput
        label="Confirm password"
        type={showPw ? "text" : "password"}
        value={password2}
        onChange={setPassword2}
        placeholder="Re-enter password"
        error={errors.password2}
      />

      <div className="terms-row">
        <label className="remember-label">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="remember-checkbox"
          />
          I agree to the{" "}
          <button type="button" className="terms-link" onClick={openTerms}>
            terms of use
          </button>
        </label>
        {errors.terms ? <p className="input-error-msg">{errors.terms}</p> : null}
      </div>

      {errors.non_field_errors ? <div className="error-alert">{errors.non_field_errors}</div> : null}

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
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h2 className="right-panel-title">Learn smarter<br />with AI</h2>
        <p className="right-panel-desc">
          Online learning Portal brings your courses to life with intelligent study tools, seamless assignment tracking, and real-time progress insights.
        </p>
        <div className="feature-list">
          {features.map((feature) => (
            <div key={feature.title} className="feature-item">
              <div className="feature-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-desc">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <StatusPopup popup={popup} onClose={() => setPopup(null)} />
      {showTerms ? <TermsModal onClose={() => setShowTerms(false)} /> : null}

      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-brand">Online Learning Portal</div>
          <h1 className="auth-title">
            {tab === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="auth-subtitle">
            {tab === "login"
              ? "Enter your credentials to access your account"
              : "Fill in the details below to get started"}
          </p>

          {tab === "login" ? (
            <LoginForm
              onSwitch={() => setTab("register")}
              onLoginSuccess={onLoginSuccess}
              showPopup={setPopup}
            />
          ) : (
            <RegisterForm
              onSwitch={() => setTab("login")}
              showPopup={setPopup}
              openTerms={() => setShowTerms(true)}
            />
          )}
        </div>

        <div className="auth-right">
          <RightPanel />
        </div>
      </div>
    </>
  );
}
