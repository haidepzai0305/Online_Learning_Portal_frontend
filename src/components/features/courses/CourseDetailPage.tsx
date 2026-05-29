import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  PlayCircle,
  Video,
  HelpCircle,
  Smartphone,
  ChevronRight,
  ShoppingCart,
  Check,
  Calendar,
  BarChart2,
  Infinity
} from "lucide-react";
import { courseService } from "../../../services/courseService";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-hot-toast";
import { cn } from "../../../lib/utils";

export function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!courseId) return;
        const data = await courseService.getCourseDetail(courseId);
        // Map backend fields to frontend expected fields
        const mappedData = {
          ...data,
          thumbnail: data.thumbnail_url || data.thumbnail,
          originalPrice: data.originalPrice || data.price * 2, // Fallback if missing
          students: data.students || 1200,
          is_enrolled: data.is_enrolled || false
        };
        setCourse(mappedData);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [courseId]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600"></div>
    </div>
  );

  if (!course) return <div className="p-20 text-center font-bold">Khóa học không tồn tại</div>;

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);
  const isAlreadyInCart = cartItems.some((item) => item.id === course.id);

  const handleAddToCart = () => {
    if (isAlreadyInCart) {
      toast.error("Khóa học đã có trong giỏ hàng.");
      return;
    }
    addToCart(course);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section - Udemy Purple Style */}
      <section className="relative bg-gradient-to-r from-[#2d0b4b] to-[#481173] py-12 lg:py-20 text-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-bold text-purple-200 mb-8 overflow-hidden whitespace-nowrap opacity-80">
            <Link to="/courses" className="hover:text-white transition-colors">Khóa học</Link>
            <ChevronRight size={14} />
            <span className="hover:text-white cursor-pointer transition-colors capitalize">{course.category || "IT & Software"}</span>
            <ChevronRight size={14} />
            <span className="text-purple-100 truncate">{course.title}</span>
          </div>

          <div className="max-w-4xl lg:pr-[400px]">
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 tracking-tight text-white drop-shadow-sm">
              {course.title}
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed font-medium opacity-90 italic">
              {course.description || "Nâng cao kỹ năng của bạn với khóa học chuyên sâu từ các chuyên gia hàng đầu."}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-amber-400">{(course.rating || 4.7).toFixed(1)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(course.rating || 4) ? "#fbbf24" : "none"} className={i < Math.floor(course.rating || 4) ? "text-amber-400" : "text-purple-300"} />
                  ))}
                </div>
                <span className="text-purple-200 font-bold underline cursor-pointer">({(course.reviewCount || 120497).toLocaleString()} đánh giá)</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Users size={18} className="text-purple-200" />
                <span>{(course.students || 659249).toLocaleString()} học viên</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/20 ring-4 ring-white/5 shadow-2xl">
                 <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random&color=fff&bold=true`} alt={course.instructor} className="w-full h-full object-cover" />
              </div>
              <div>
                 <p className="text-[10px] text-purple-300 font-black uppercase tracking-widest leading-none mb-1">Giảng viên chính</p>
                 <p className="text-lg font-black text-white hover:text-cyan-400 transition-colors cursor-pointer">{course.instructor}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "💬 Phụ đề Việt chất lượng cao", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20" },
                { label: "🌐 Phụ đề tiếng Anh", color: "bg-blue-500/20 text-blue-300 border-blue-500/20" },
                { label: "🔥 Bán chạy", color: "bg-amber-500/20 text-amber-300 border-amber-500/20" },
                { label: "⭐ Tuyệt vời", color: "bg-pink-500/20 text-pink-300 border-pink-500/20" }
              ].map((badge, idx) => (
                <div key={idx} className={cn("flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black border backdrop-blur-md", badge.color)}>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Sidebar Action Card */}
        <div className="container mx-auto px-6 lg:px-12 relative lg:h-0">
           <div className="w-full lg:w-[360px] lg:absolute lg:right-12 lg:-top-96 z-50 mt-12 lg:mt-0">
              <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col group">
                 {/* Preview Section */}
                 <div className="relative aspect-video bg-black overflow-hidden m-2 rounded-[24px] cursor-pointer ring-1 ring-slate-100">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                      onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop"}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform shadow-2xl">
                          <PlayCircle size={40} fill="white" className="text-black ml-1" />
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center animate-bounce">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">Xem video giới thiệu</p>
                    </div>
                 </div>

                 {/* Pricing Info */}
                 <div className="p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                       <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatPrice(course.price)}đ</span>
                       {course.originalPrice > course.price && (
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-400 line-through leading-none">{formatPrice(course.originalPrice)}đ</span>
                           <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg mt-1 w-fit">Giảm {Math.round((1 - course.price/course.originalPrice) * 100)}%</span>
                         </div>
                       )}
                    </div>

                    <div className="space-y-3 mb-8">
                       {course.is_enrolled ? (
                         <Link 
                           to={`/portal/student/learning/${course.id}`}
                           className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black flex items-center justify-center gap-3 text-base shadow-2xl transition-all active:scale-95 shadow-emerald-200"
                         >
                            <PlayCircle size={20} /> Tiếp tục học tập
                         </Link>
                       ) : (
                         <>
                           <button 
                             onClick={handleAddToCart}
                             disabled={isAlreadyInCart}
                             className={cn(
                               "w-full h-14 rounded-2xl font-black flex items-center justify-center gap-3 text-base shadow-2xl transition-all active:scale-95",
                               isAlreadyInCart 
                                 ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                 : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-200"
                             )}
                           >
                              <ShoppingCart size={20} /> {isAlreadyInCart ? "Đã trong giỏ hàng" : "Thêm vào giỏ hàng"}
                           </button>
                           <button className="w-full h-14 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-black rounded-2xl transition-all active:scale-95">
                              Mua ngay bây giờ
                           </button>
                         </>
                       )}
                    </div>

                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Cam kết hoàn tiền trong 30 ngày</p>

                    <div className="pt-8 border-t border-slate-100">
                       <h4 className="text-xs font-black text-slate-900 mb-5 uppercase tracking-wider">Khóa học này bao gồm:</h4>
                       <ul className="grid grid-cols-1 gap-4">
                          {[
                            { icon: Video, text: `${course.duration || "32.0"} giờ video` },
                            { icon: BookOpen, text: `${course.materials?.length || 0} bài giảng` },
                            { icon: BarChart2, text: "29 bài thi thử chuyên sâu" },
                            { icon: Infinity, text: "Quyền truy cập trọn đời" },
                            { icon: Smartphone, text: "Học trên điện thoại & TV" },
                            { icon: Award, text: "Chứng chỉ hoàn tất" }
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-center text-sm font-bold text-slate-600">
                               <item.icon size={16} className="text-cyan-500 shrink-0" />
                               <span>{item.text}</span>
                            </li>
                          ))}
                       </ul>
                    </div>

                    <div className="mt-8 flex justify-center gap-8">
                       <button className="text-xs font-black text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-cyan-600 hover:border-cyan-600 transition-colors">Chia sẻ</button>
                       <button className="text-xs font-black text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-cyan-600 hover:border-cyan-600 transition-colors">Tặng quà</button>
                       <button className="text-xs font-black text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-cyan-600 hover:border-cyan-600 transition-colors">Mã giảm giá</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Main Page Content - Clean & Modern */}
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20 relative">
        <div className="max-w-4xl lg:pr-[420px]">
          
          {/* Outcomes Grid - Green Box Style */}
          <section className="mb-20 rounded-[40px] p-8 lg:p-12 border-2 border-emerald-100 bg-emerald-50/30 ring-8 ring-emerald-50/10">
             <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full" /> Bạn sẽ học được gì?
             </h3>
             <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {(course.learningGoals || [
                  "Làm chủ hoàn toàn các kiến thức cốt lõi của khóa học",
                  "Thực hành qua 20+ dự án thực tế trong studio",
                  "Kỹ năng xử lý lỗi và tối ưu hóa hệ thống",
                  "Chiến lược để vượt qua các kỳ thi chứng chỉ quốc tế"
                ]).map((goal: string, id: number) => (
                  <div key={id} className="flex gap-3 items-start group">
                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" strokeWidth={4} />
                    <span className="text-[15px] font-bold text-slate-600 leading-snug">{goal}</span>
                  </div>
                ))}
             </div>
          </section>

          {/* Detailed Description */}
          <section className="mb-20">
             <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Chi tiết về khóa học</h3>
             <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed font-medium space-y-6">
                <p>{course.description}</p>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-500">
                  "Đây không chỉ là một khóa học, mà là hành trình thay đổi sự nghiệp của bạn. Tôi đã tích hợp toàn bộ kinh nghiệm thực tế của mình để biến những khối kiến thức khô khan thành những bài học dễ tiếp thu nhất."
                </div>
                <p>
                  Chúng tôi cam kết hỗ trợ bạn 24/7 thông qua cộng đồng học viên UniLearn. 
                  Hãy bắt đầu hành trình ngay hôm nay để không bỏ lỡ những cơ hội tuyệt vời trong tương lai!
                </p>
             </div>
          </section>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             {[
               { icon: Calendar, title: "Cập nhật mới", text: "17/03/2026" },
               { icon: Smartphone, title: "Học mọi lúc", text: "Mobile & Web" },
               { icon: HelpCircle, title: "Hỗ trợ 24/7", text: "UniLearn Community" }
             ].map((item, i) => (
               <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors mb-4">
                     <item.icon size={24} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.text}</p>
               </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
