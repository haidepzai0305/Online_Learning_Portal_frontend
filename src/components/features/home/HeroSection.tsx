import { Search, Menu, ShoppingCart, User, LogOut } from "lucide-react";

interface HeroSectionProps {
  userName?: string;
  onLogout?: () => void;
  progress?: number;
}
export function HeroSection({
  userName = "Sơn",
  onLogout,
  progress = 0 // Mặc định là 0 nếu chưa có dữ liệu
}: HeroSectionProps) {
  const CYBER_CYAN = "#00f2ff";

  return (
    <section className="relative min-h-screen bg-[#060B18] text-white flex flex-col items-center overflow-hidden font-sans">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.2'%3E%3Cpath d='M20 20h2v2h-2zM40 40h2v2h-2zM60 60h2v2h-2zM80 80h2v2h-2zM0 0h2v2H0zM20 0h2v2h-2zM40 0h2v2h-2zM60 0h2v2h-2zM80 0h2v2h-2zM0 20h2v2H0zM0 40h2v2H0zM0 60h2v2H0zM0 80h2v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px', // Điều chỉnh kích thước họa tiết
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] blur-[120px] rounded-full opacity-25"
        style={{ backgroundColor: CYBER_CYAN }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-teal-900/10 blur-[100px] rounded-full" />
      {/* ========================================================== */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 md:px-10 py-6">
        <button className="flex items-center gap-2.5 bg-[#0D1627] hover:bg-[#111A2E] text-[#69EAEF] font-semibold px-4 py-2 rounded-lg border border-gray-800/50 shadow-inner">
          <Menu size={18} />
          <span className="uppercase text-xs tracking-[0.2em]">menu</span>
        </button>

        <div className="relative flex-1 max-w-xl mx-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
          <input
            type="text"
            placeholder="Tìm khóa học: Cyber Security, Big Data..."
            className="w-full bg-[#0D1627]/80 border border-gray-800 text-xs text-gray-200 pl-11 pr-4 py-3 rounded-full placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-5">
          <button className="relative text-cyan-400">
            <ShoppingCart size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-[#060B18] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">3</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium">{userName}'s name</span>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-white/5 glow-avatar">
              <User size={16} className="text-[#060B18]" />
            </div>
          </div>

          <button onClick={onLogout} className="text-gray-600 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center">
        {/* Badge (Giữ nguyên) */}
        <div className="inline-flex items-center gap-2.5 bg-[#0D1627]/90 border border-teal-500/10 backdrop-blur-sm rounded-full px-5 py-2 mb-10 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_6px_#2dd4bf] animate-pulse" />
          <span className="text-teal-400 text-[11px] font-medium tracking-wide">
            Chào buổi tối, AI đã chuẩn bị lộ trình học cho bạn
          </span>
        </div>
        {/* Headline & Subtitle*/}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-7 tracking-tighter leading-tight">
          <span className="text-white">Master the Core </span>
          <span className="text-[#69EAEF] block glow-text-cyber">Secure your Future.</span>
        </h1>

        <p className="text-gray-400 text-base max-w-xl mb-12 leading-relaxed font-light">
          Chào <span className="text-[#69EAEF] font-semibold">{userName}</span>, AI Assistant đã chuẩn bị lộ trình học tối ưu cho bạn. Bắt đầu ngay!
        </p>

        <div className="w-full max-w-md mb-14">
          <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2.5 font-bold">
            <span className="text-xs">thanh tiến độ</span>
            {/* Hiển thị con số động */}
            <span>{progress}%</span>
          </div>

          <div className="h-1.5 bg-[#0D1627]/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-300 rounded-full progress-bar-glow transition-all duration-500 ease-out"
              // Style width sẽ thay đổi theo biến progress
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* ========================================================== */}
        <div className="flex gap-3.5 mb-24">
          <button
            className="text-[#060B18] font-bold px-10 py-3 rounded-md text-[13px] tracking-wide uppercase transition-all hover:scale-105"
            style={{ backgroundColor: CYBER_CYAN }}
          >
            get started
          </button>
          <button className="bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-bold px-10 py-3 rounded-md text-[13px] tracking-wide uppercase backdrop-blur-sm transition-all hover:bg-cyan-500/5 hover:-translate-y-0.5">
            let's explore
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <FeatureCard title="Phụ đề/Tài liệu chuẩn" />
          <FeatureCard title="Lộ trình AI cá nhân hóa" />
          <FeatureCard title="Video Full HD với phụ đề" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title }: { title: string }) {
  return (
    <div className="bg-[#0D1627]/40 backdrop-blur-xl border border-gray-800/60 rounded-xl p-8 hover:bg-[#111A2E]/60 hover:border-teal-500/20 transition-all cursor-pointer group shadow-lg">
      <h3 className="text-white font-bold text-base group-hover:text-teal-400 transition-colors">{title}</h3>
    </div>
  );
}