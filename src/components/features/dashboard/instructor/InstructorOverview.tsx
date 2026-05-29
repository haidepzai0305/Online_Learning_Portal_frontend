import { Users, CreditCard, Star, FileText, Sparkles, TrendingUp, TrendingDown, BookOpen } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockPortalData } from "../../../../data/mockPortalData";
import { cn } from "../../../../lib/utils";
import { Link } from "react-router-dom";

const data = mockPortalData.instructor.overview;

const stats = [
  { label: "Tổng Học viên", value: data.totalStudents.toLocaleString(), icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Doanh thu (VND)", value: (data.totalRevenue / 1000000).toFixed(1) + "M", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Điểm đánh giá", value: data.averageRating, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Chờ chấm điểm", value: data.pendingGrading, icon: FileText, color: "text-rose-400", bg: "bg-rose-500/10" },
];

export default function InstructorOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Dashboard Của Bạn</h1>
          <p className="mt-1 text-slate-400">Xem thống kê cập nhật từ hệ thống UniLearn.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/portal/instructor/courses"
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <BookOpen size={16} />
            Quản lý khoá học
          </Link>
          <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <FileText size={16} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-500/30">
              <div className={cn("absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full blur-[40px]", s.bg)} />
              <div className="relative z-10 flex items-center justify-between">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", s.bg, s.color)}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="mt-1 text-sm font-medium text-slate-400">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0B1524]/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Lượt Đăng Ký</h2>
              <p className="text-sm text-slate-400">Khoảng 6 tháng gần nhất</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.enrollmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1524', borderColor: '#ffffff15', borderRadius: '12px' }}
                  itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="students" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="flex flex-col rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-[#0B1524]/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Tổng hợp</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Insight</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-sm text-slate-300">
              Phân tích từ <strong className="text-white">{data.topQuestions.reduce((sum, q) => sum + q.count, 0)}</strong> câu hỏi gần đây, sinh viên của bạn đang gặp khó khăn cực kì lớn ở các chủ đề sau:
            </p>
            <div className="space-y-3 mt-4">
              {data.topQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{q.cluster}</div>
                    <div className="text-xs text-slate-400">{q.count} thảo luận mới</div>
                  </div>
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", q.trend === "up" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                    {q.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <button className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
                Tạo bài học phụ trợ bổ sung
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0B1524]/50 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-6">Phân Bố Điểm (Tổng quát)</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.scoreDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1524', borderColor: '#ffffff15', borderRadius: '12px' }}
                    cursor={{fill: '#ffffff10'}}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0B1524]/50 p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 ring-1 ring-cyan-500/30">
               <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Xem lại danh sách</h3>
            <p className="mt-2 text-sm text-slate-400">Bạn có 32 bài tập đang chưa chấm hôm nay. Hãy tiếp tục công việc nhé!</p>
            <button className="mt-6 font-bold text-slate-900 bg-white hover:bg-slate-200 px-6 py-2.5 rounded-xl transition">
               Bắt đầu chấm bài
            </button>
        </div>
      </div>
    </div>
  );
}
