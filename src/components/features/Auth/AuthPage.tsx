import { useMemo, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "../../../lib/utils";
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
import {
  loginFormSchema,
  registerFormSchema,
  zodIssuesToFieldErrors,
} from "../../../lib/authSchemas";
import { buildSanitizedLoginPayload, buildSanitizedRegisterPayload } from "../../../lib/sanitizeAuth";
import { formatApiErrorMessage } from "../../../utils/apiError";

interface AuthPageProps {
  onLoginSuccess?: (name: string) => void;
}

type Tab = "login" | "register";

function LoginForm({ onSwitch, onLoginSuccess }: { onSwitch: () => void; onLoginSuccess?: (name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const canSubmit = useMemo(
    () => loginFormSchema.safeParse({ email: email.trim(), password }).success,
    [email, password]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submittingRef.current || loading) return;

    const parsed = loginFormSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const fields = zodIssuesToFieldErrors(parsed.error);
      const first = fields.email ?? fields.password ?? "Dữ liệu chưa hợp lệ.";
      toast.error(first);
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const payload = buildSanitizedLoginPayload(parsed.data.email, parsed.data.password);
      const data = await loginRequest(payload);
      const accessToken = getAccessToken(data);
      if (!accessToken) throw new Error("Phản hồi đăng nhập không chứa access token.");

      localStorage.setItem("access_token", accessToken);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);

      let currentUser;
      try { currentUser = await fetchCurrentUser(); } catch { currentUser = undefined; }

      const role = getUserRole(data, currentUser);
      const displayName = getUserDisplayName(data, payload.email, currentUser);

      localStorage.setItem("user_role", role);
      if (remember) localStorage.setItem("remember_user", payload.email);
      onLoginSuccess?.(displayName);
      toast.success("Đăng nhập thành công!");
      window.location.href = "/";
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700 block">Email hoặc tên đăng nhập</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <Mail size={18} strokeWidth={2.5} />
          </span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-4 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700 block">Mật khẩu</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-10 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
          >
            {showPw ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#007AB0] focus:ring-[#007AB0]"
          />
          <span className="text-[13px] font-medium text-slate-600">Ghi nhớ đăng nhập</span>
        </label>
        <button type="button" className="text-[13px] font-semibold text-[#007AB0] hover:text-[#006a99]">Quên mật khẩu?</button>
      </div>

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full rounded-lg bg-[#007AB0] mt-1 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-[#006a99] disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      <div className="relative py-4">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
        <span className="relative z-10 mx-auto block w-fit bg-white px-4 text-[12px] font-medium text-slate-400">Chưa có tài khoản?</span>
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-[14.5px] font-bold text-slate-700 transition hover:bg-slate-50"
      >
        Đăng ký tài khoản mới
      </button>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const registerValues = useMemo(() => ({
    fullName, email, username, password, password2, role: "student" as UserRole, acceptedTerms: true
  }), [fullName, email, username, password, password2]);

  const canSubmit = useMemo(() => registerFormSchema.safeParse(registerValues).success, [registerValues]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submittingRef.current || loading) return;

    const parsed = registerFormSchema.safeParse(registerValues);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Lỗi dữ liệu");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const apiBody = buildSanitizedRegisterPayload({
        email: parsed.data.email,
        username: parsed.data.username,
        password: parsed.data.password,
      });
      await registerRequest(apiBody);
      toast.success("Đăng ký thành công!");
      onSwitch();
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Tên đăng nhập *</label>
          <input
            type="text"
            placeholder="username"
            value={username} onChange={e => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] px-3.5 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Số điện thoại</label>
          <input
            type="text"
            placeholder="0912345678"
            value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] px-3.5 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700">Tên của bạn *</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <User size={18} strokeWidth={2.5} />
          </span>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            value={fullName} onChange={e => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-4 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700">Gmail *</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <Mail size={18} strokeWidth={2.5} />
          </span>
          <input
            type="email"
            placeholder="Gmail hoặc Mail có sử dụng Google Drive"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-4 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700">Mật khẩu *</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Ít nhất 6 ký tự"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-10 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
          >
            {showPw ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700">Xác nhận mật khẩu *</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={password2} onChange={e => setPassword2(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-[9px] pl-10 pr-4 text-[14px] focus:border-blue-500 outline-none transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full rounded-lg bg-[#007AB0] mt-1 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-[#006a99] disabled:opacity-50"
      >
        {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>

      <div className="relative py-4">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
        <span className="relative z-10 mx-auto block w-fit bg-white px-4 text-[12px] font-medium text-slate-400">Đã có tài khoản?</span>
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-[14.5px] font-bold text-slate-700 transition hover:bg-slate-50"
      >
        Đăng nhập
      </button>
    </form>
  );
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [tab, setTab] = useState<Tab>("login");

  const isLogin = tab === "login";

  return (
    <div className={cn(
      "flex min-h-screen bg-white font-sans text-slate-900 transition-all duration-500",
      isLogin ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Form Panel */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007AB0] text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </div>
            <span className="text-[20px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#007AB0] to-[#b854f5]">StudyVN.Academy</span>
          </div>

          <div className="mb-6">
            <h1 className="text-[26px] font-bold mb-1 text-slate-900">
              {isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản"}
            </h1>
            <p className="text-[14px] font-normal text-slate-500">
              {isLogin ? "Đăng nhập để tiếp tục học tập" : "Đăng ký để bắt đầu học tập ngay hôm nay"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm onSwitch={() => setTab("register")} onLoginSuccess={onLoginSuccess} />
          ) : (
            <RegisterForm onSwitch={() => setTab("login")} />
          )}
        </div>
      </div>

      {/* Illustration Panel */}
      <div className="hidden w-1/2 flex-col items-center justify-center p-12 text-white md:flex" style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decorations */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "40%", right: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="w-full max-w-[420px] text-center flex flex-col items-center" style={{ position: "relative", zIndex: 1 }}>
          {/* Illustration image */}
          <img
            src={isLogin ? "/auth_login.png" : "/auth_register.png"}
            alt={isLogin ? "Học tập không giới hạn" : "Bắt đầu hành trình học tập"}
            style={{
              width: "100%",
              maxWidth: 340,
              marginBottom: 32,
              borderRadius: 20,
              filter: "drop-shadow(0 20px 40px rgba(99,102,241,0.2))",
            }}
          />

          {/* Headline */}
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
            {isLogin ? "Học tập không giới hạn" : "Bắt đầu hành trình"}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(148,163,184,0.9)", lineHeight: 1.7, maxWidth: 320 }}>
            {isLogin
              ? "Truy cập hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu"
              : "Tạo tài khoản miễn phí để truy cập hàng ngàn khóa học chất lượng"}
          </p>

          {/* Feature badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 32 }}>
            {["Phụ đề Tiếng Việt", "Video Full HD", "Chứng chỉ"].map((text) => (
              <span key={text} style={{
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                fontSize: 12,
                fontWeight: 600,
                color: "#a5b4fc",
              }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

