import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Play, BookOpen, Clock } from "lucide-react";
import { courseService } from "../../../../services/courseService";

export default function StudentOverview() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        setLoading(true);
        const data = await courseService.listEnrolledCourses();
        setCourses(data.courses || []); // Accessing the 'courses' key from response
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6 font-sans">
      <div className="mx-auto max-w-7xl">

        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Khóa học của tôi</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider border border-blue-100">
                {courses.length} khóa học đã mua
              </span>
            </div>
          </div>
          <Link
            to="/courses"
            className="group flex items-center gap-2 px-8 h-14 rounded-2xl font-black text-sm text-white transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-95"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Khám phá thêm
          </Link>
        </div>

        {/* Content Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Hành trình học tập đang chờ bạn</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Bạn chưa đăng ký khóa học nào. Hãy bắt đầu ngay để nâng cấp kỹ năng của mình!</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 px-10 h-16 rounded-2xl font-black text-white shadow-2xl shadow-blue-200"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
            >
              Xem danh sách khóa học
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col hover:-translate-y-2">
                {/* Visual Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000"
                    onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Information Area */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-black text-slate-900 text-xl leading-tight mb-4 line-clamp-2 min-h-[56px] tracking-tight">
                    {course.title}
                  </h3>

                  <div className="space-y-6 mt-auto">
                    {/* Stats & Progress */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-blue-500" />
                          Tiến độ: <span className="text-slate-900">{course.progress || 0}%</span>
                        </div>
                        <div>
                          Mua: {course.purchaseDate || "16/04/2026"}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${course.progress || 0}%`,
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                          }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      to={`/portal/student/learning/${course.id}`}
                      className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black text-sm text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95"
                      style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
                    >
                      <Play size={16} fill="white" className="ml-1" />
                      Vào học ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
