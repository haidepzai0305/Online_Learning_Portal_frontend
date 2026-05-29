import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  MessageSquare,
  PlusCircle,
  Menu,
  ChevronLeft,
  Bell,
  Award,
  User,
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";

const STUDENT_LINKS = [
  { href: "/portal/student", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/portal/student/learning", label: "Đang học", icon: BookOpen },
  { href: "/portal/notifications", label: "Thông báo", icon: Bell },
  { href: "/portal/student/orders", label: "Lịch sử thanh toán", icon: Award },
  { href: "/portal/student/settings", label: "Cài đặt", icon: Settings },
];

const INSTRUCTOR_LINKS = [
  { href: "/portal/instructor", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/portal/instructor/courses", label: "Khoá học của tôi", icon: BookOpen },
  { href: "/portal/instructor/builder", label: "Tạo khóa học", icon: PlusCircle },
  { href: "/portal/notifications", label: "Thông báo", icon: Bell },
  { href: "/portal/instructor/settings", label: "Cài đặt & Thanh toán", icon: Settings },
];

export default function PortalLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("user_role") || "student";
  
  const navLinks = role === "professor" ? INSTRUCTOR_LINKS : STUDENT_LINKS;

  // Auto-collapse on small screens
  useEffect(() => {
    const checkScreen = () => setIsCollapsed(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#07111f] text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#0B1524]/95 shadow-[0_0_50px_rgba(2,9,20,0.5)] backdrop-blur-2xl transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Link to="/" className={cn("text-xl font-black transition-opacity", isCollapsed && "hidden")}>
            Uni<span className="text-cyan-400">Learn</span>
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className={cn("mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500", isCollapsed && "hidden")}>
            {role === "professor" ? "Giảng viên" : "Học viên"}
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  title={isCollapsed ? link.label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_2px_0_0_#22d3ee]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon size={20} className={cn("shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]")} />
                  {!isCollapsed && <span className="font-semibold text-sm">{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          <div className={cn("flex items-center gap-3 rounded-2xl bg-white/5 p-3", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
              <User size={18} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-white">
                  {localStorage.getItem("user_name") || "Nhà sáng tạo"}
                </p>
                <p className="truncate text-xs text-slate-400">Premium</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 transition-all duration-300 flex flex-col", isCollapsed ? "pl-20" : "pl-64")}>
        {/* Top bar for Dashboard */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#07111f]/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Header left placeholder (Breadcrumb or greeting) */}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:text-white">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
            </button>
            <Link to="/" className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20">
              <LogOut size={16} />
              Thoát Portal
            </Link>
          </div>
        </header>
        
        {/* Render child routes */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
