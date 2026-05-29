import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Users, Tag } from "lucide-react";
import toast from "react-hot-toast";
import courseService from "../../../../services/courseService";
import { Link, useNavigate } from "react-router-dom";

export default function InstructorCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const data = await courseService.listMyCourses();
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("Không thể tải danh sách khóa học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      await courseService.deleteCourse(id);
      toast.success("Đã xóa khóa học.");
      fetchCourses();
    } catch (err) {
      toast.error("Lỗi khi xóa khóa học.");
    }
  };

  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: "" });

  const handleEditClick = (course: any) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      description: course.description || "",
      price: course.price.toString()
    });
  };

  const handleUpdate = async () => {
    try {
      await courseService.updateCourse(editingCourse.id, {
        ...editForm,
        price: parseFloat(editForm.price)
      });
      toast.success("Đã cập nhật khóa học.");
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      toast.error("Lỗi khi cập nhật.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Edit Modal */}
        {editingCourse && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Chỉnh sửa khóa học</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Tiêu đề</label>
                  <input 
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Mô tả</label>
                  <textarea 
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all min-h-[120px]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Giá (VND)</label>
                  <input 
                    type="number"
                    value={editForm.price}
                    onChange={e => setEditForm({...editForm, price: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 rounded-xl bg-[#3b82f6] py-3.5 text-sm font-bold text-white hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[32px] font-bold text-[#1e293b] leading-tight mb-2">Quản lý khóa học</h1>
            <p className="text-slate-500 font-medium">Danh sách các nội dung bạn đang giảng dạy.</p>
          </div>
          <button 
            onClick={() => navigate("/portal/instructor/builder")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 active:scale-95 w-fit"
          >
            <Plus size={18} />
            Tạo Khóa Học Mới
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] rounded-[24px] bg-slate-100 animate-pulse" />
             ))
          ) : courses.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="text-slate-400 font-medium text-lg">Bạn chưa có khóa học nào. Hãy bắt đầu ngay!</div>
            </div>
          ) : (
            courses.map((course) => (
              <div 
                key={course.id} 
                className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                      course.status === "Published" ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[17px] font-bold text-[#1e293b] line-clamp-2 leading-snug mb-3 min-h-[48px]">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-blue-500 mb-6">
                    <Tag size={14} />
                    {course.category || "General"}
                  </div>

                  <div className="mt-auto space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Học viên</span>
                        <div className="flex items-center gap-1.5 font-bold text-[#1e293b]">
                          <Users size={16} className="text-slate-400" />
                          {course.students}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Giá bán</span>
                        <div className="font-black text-blue-600">
                          {new Intl.NumberFormat("vi-VN").format(course.price)}đ
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => handleEditClick(course)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-100 hover:text-blue-500 active:scale-[0.98]"
                      >
                        <Edit size={16} />
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 active:scale-[0.98]"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                       <Link 
                        to={`/courses/${course.id}`}
                        target="_blank"
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 transition hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
