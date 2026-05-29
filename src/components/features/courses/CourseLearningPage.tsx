import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Play, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Star,
  Share2,
  MoreVertical,
  MessageSquare,
  FileText,
  Info,
  Award,
  Circle,
  Trophy,
  ArrowLeft,
  Check,
  Send,
  Sparkles,
  Trash2
} from "lucide-react";
import { courseService } from "../../../services/courseService";
import { cn } from "../../../lib/utils";
import { toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CourseLearningPage() {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [qaList, setQaList] = useState<any[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) return;
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
        if (data.materials && data.materials.length > 0) {
          setActiveLesson(data.materials[0]);
        }
        
        // Fetch QA
        const qaRes = await fetch(`/api/courses/${courseId}/qa/`, {
           headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        });
        const qaData = await qaRes.json();
        setQaList(qaData.qa || []);

        // Fetch Note
        const noteRes = await fetch(`/api/courses/${courseId}/notes/`, {
           headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        });
        const noteData = await noteRes.json();
        setNoteContent(noteData.content || "");

      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleSaveNote = async () => {
     try {
        setIsSavingNote(true);
        await fetch(`/api/courses/${courseId}/notes/save/`, {
           method: "POST",
           headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
           },
           body: JSON.stringify({ content: noteContent })
        });
        toast.success("Đã lưu ghi chú");
     } catch (err) {
        toast.error("Lỗi khi lưu ghi chú");
     } finally {
        setIsSavingNote(false);
     }
  };

  const handlePostQuestion = async () => {
     if (!newQuestion.trim()) return;
     try {
        const res = await fetch(`/api/courses/${courseId}/qa/post/`, {
           method: "POST",
           headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
           },
           body: JSON.stringify({ question: newQuestion })
        });
        const data = await res.json();
        setQaList(prev => [{
           id: data.id,
           user: "Tôi",
           date: "Vừa xong",
           question: newQuestion,
           answer: null
        }, ...prev]);
        setNewQuestion("");
        toast.success("Đã gửi câu hỏi");
     } catch (err) {
        toast.error("Lỗi khi gửi câu hỏi");
     }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube-nocookie.com/embed/${match[2]}` : url;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!course) return <div className="p-20 text-center font-bold">Khóa học không tồn tại</div>;

  const totalLessons = course.materials?.length || 0;
  const currentIndex = course.materials?.findIndex((m: any) => m.id === activeLesson?.id) ?? 0;
  const progressPercent = Math.round(((currentIndex + 1) / totalLessons) * 100);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* ── Light Modern Header (Match Front-end) ── */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link to="/portal/student" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-slate-500 hover:text-blue-600">
             <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-3 truncate">
             <span className="text-xl font-black text-slate-900 hidden lg:block">Uni<span className="text-blue-600">Learn</span></span>
             <div className="hidden lg:block w-1 h-1 rounded-full bg-slate-300"></div>
             <h1 className="text-sm font-black text-slate-900 truncate tracking-tight pt-0.5">
                {course.title}
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
           {/* Progress Indicator with Gradient */}
           <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
              <div className="relative w-9 h-9 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
                    <circle cx="18" cy="18" r="15" stroke="url(#gradient)" strokeWidth="3" fill="transparent" 
                      strokeDasharray={94.2} strokeDashoffset={94.2 - (94.2 * progressPercent / 100)} className="transition-all duration-1000 ease-out" 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <Trophy size={12} className="absolute text-blue-500" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Tiến độ khóa học</span>
                 <span className="text-xs font-black text-slate-900">{progressPercent}% Hoàn tất</span>
              </div>
           </div>
           
           <button className="hidden sm:flex items-center gap-2 px-6 h-10 rounded-xl font-black text-xs text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all" 
             style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}>
              <Star size={14} fill="white" /> Viết đánh giá
           </button>
           
           <div className="flex items-center gap-1">
              <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-500">
                 <Share2 size={18} />
              </button>
              <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-500">
                 <MoreVertical size={18} />
              </button>
           </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Video & Content Area */}
        <main 
          ref={mainContentRef}
          className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar bg-white scroll-smooth"
        >
           {/* Cinematic Video Container */}
           <div className={cn(
             "w-full bg-slate-900 relative group flex items-center justify-center shadow-2xl z-10",
             isSidebarOpen ? "aspect-video" : "aspect-video md:h-[75vh]"
           )}>
              {activeLesson?.stream_url ? (
                <video
                  key={activeLesson.id}
                  controls
                  className="w-full h-full shadow-2xl"
                  controlsList="nodownload"
                  autoPlay
                  onLoadedMetadata={(e) => {
                    if (activeLesson?.start_time) {
                      e.currentTarget.currentTime = activeLesson.start_time;
                    }
                  }}
                >
                  <source src={`${activeLesson.stream_url}?token=${localStorage.getItem("access_token")}`} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              ) : activeLesson?.video_url ? (
                <iframe
                  key={activeLesson.id}
                  src={`${getYoutubeEmbedUrl(activeLesson.video_url)}?rel=0&modestbranding=1&autoplay=0`}
                  className="w-full h-full border-0 shadow-2xl"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-slate-600">
                   <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Play size={40} className="text-slate-500 ml-1 opacity-50" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-widest text-slate-500">Đang chuẩn bị bài giảng...</p>
                </div>
              )}
           </div>

           {/* Content & Tabs */}
           <div className="flex flex-col flex-1 bg-white">
              <div className="border-b border-slate-100 px-8 sm:px-12 pt-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-10">
                    {[
                      { id: "overview", label: "Tổng quan", icon: Info },
                      { id: "qa", label: "Hỏi & Đáp", icon: MessageSquare },
                      { id: "notes", label: "Ghi chú", icon: FileText },
                      { id: "resources", label: "Tài liệu", icon: Award }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "pb-4 text-xs font-black uppercase tracking-wider transition-all relative",
                          activeTab === tab.id ? "text-blue-600" : "text-slate-400 hover:text-slate-900"
                        )}
                      >
                         {tab.label}
                         {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(59,130,246,0.5)]" />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="p-8 sm:p-12 max-w-5xl mx-auto w-full">
                 {activeTab === "overview" && (
                   <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div>
                         <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                            {activeLesson?.title || "Chi tiết bài học này"}
                         </h2>
                         <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed font-medium">
                             {activeLesson?.content || "Chào mừng bạn đến với bài học! Hãy tập trung cao độ để đạt kết quả tốt nhất nhé. Xem video bên trên và sử dụng Trợ lý AI ở thanh bên để đặt câu hỏi về nội dung bài giảng."}
                          </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8 p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50">
                         {[
                           { label: "Cấp độ học", val: "Toàn diện", color: "text-blue-600 bg-blue-50" },
                           { label: "Học viên", val: (course.students || 1200).toLocaleString(), color: "text-purple-600 bg-purple-50" },
                           { label: "Chứng chỉ", val: "UniLearn Verified", color: "text-emerald-600 bg-emerald-50" }
                         ].map((item, idx) => (
                           <div key={idx} className="flex flex-col items-center text-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{item.label}</span>
                              <span className={cn("px-4 py-1.5 rounded-full text-xs font-black border border-transparent", item.color)}>
                                 {item.val}
                              </span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {activeTab === "qa" && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-inner">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Đặt câu hỏi mới</h3>
                         <div className="relative">
                            <textarea 
                               value={newQuestion}
                               onChange={(e) => setNewQuestion(e.target.value)}
                               placeholder="Bạn đang thắc mắc điều gì?..."
                               className="w-full p-6 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-300 text-sm shadow-sm"
                            />
                            <button 
                               onClick={handlePostQuestion}
                               className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                            >
                               Gửi câu hỏi
                            </button>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                         {qaList.length === 0 && <p className="text-center text-slate-400 py-10 italic">Chưa có câu hỏi nào. Hãy là người đầu tiên!</p>}
                         {qaList.map((item, i) => (
                           <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{item.user[0]}</div>
                                 <div>
                                    <p className="text-xs font-black text-slate-900">{item.user}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</p>
                                 </div>
                              </div>
                              <p className="text-sm font-bold text-slate-800 mb-4 ml-11">"{item.question}"</p>
                              {item.answer ? (
                                <div className="ml-11 p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                                   <p className="text-xs text-slate-600 leading-relaxed"><span className="font-black text-blue-600 mr-2">Trả lời:</span>{item.answer}</p>
                                </div>
                              ) : (
                                <div className="ml-11 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase italic">Đang chờ giảng viên trả lời...</p>
                                </div>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {activeTab === "notes" && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="flex items-center justify-between">
                         <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ghi chú cá nhân</h2>
                      </div>
                      <textarea 
                         value={noteContent}
                         onChange={(e) => setNoteContent(e.target.value)}
                         placeholder="Viết ghi chú cho bài học này..."
                         className="w-full h-64 p-8 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 text-slate-700 font-medium leading-relaxed shadow-inner resize-none"
                      />
                      <div className="flex justify-end">
                         <button 
                           onClick={handleSaveNote}
                           disabled={isSavingNote}
                           className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"
                         >
                            {isSavingNote ? "Đang lưu..." : "Lưu ghi chú"}
                         </button>
                      </div>
                   </div>
                 )}

                 {activeTab === "resources" && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tài liệu học tập</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                         {course.materials?.filter((m: any) => m.type !== 'VIDEO').length === 0 && (
                            <p className="text-slate-400 italic">Chưa có tài liệu đính kèm cho bài học này.</p>
                         )}
                         {course.materials?.filter((m: any) => m.type !== 'VIDEO').map((file: any, i: number) => (
                           <div key={i} className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FileText size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-slate-800">{file.title}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase">{file.type} • Click để xem</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => window.open(file.file_url || file.video_url || '#', '_blank')}
                                className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors"
                              >
                                 <Play size={20} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </main>

        {/* ── Match UI Sidebar (Light Mode) ── */}
        <aside 
          className={cn(
            "bg-white border-l border-slate-200 transition-all duration-500 flex flex-col shrink-0 z-40 overflow-hidden relative shadow-2xl",
            isSidebarOpen ? "w-[420px]" : "w-0"
          )}
        >
           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Trợ lý Học tập AI</h3>
                  <p className="text-[10px] font-bold text-slate-400 italic">Sẵn sàng hỗ trợ bạn 24/7</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
              >
                 <ChevronRight size={20} />
              </button>
           </div>

           <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
               <AIChatSection courseId={courseId} />
           </div>

           <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center justify-between px-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang xem: <span className="text-blue-600">{activeLesson?.title || "Bài giảng"}</span></p>
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400">AI Online</span>
                 </div>
              </div>
           </div>
        </aside>

         {/* Sidebar Trigger (When closed) */}
        {!isSidebarOpen && (
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white text-blue-600 p-3 rounded-l-2xl shadow-2xl border border-r-0 border-slate-200 hover:pr-6 transition-all"
           >
              <ChevronLeft size={24} />
           </button>
        )}
      </div>
    </div>
  );
}

const CHAT_STORAGE_KEY = (courseId: string) => `unilearn_chat_history_${courseId}`;

function AIChatSection({ courseId }: { courseId: string | undefined }) {
  const [messages, setMessages] = useState<{ role: string; text: string; timestamp?: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load lịch sử từ localStorage khi mở
  useEffect(() => {
    if (!courseId) return;
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY(courseId));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (_) {}
    setIsLoaded(true);
  }, [courseId]);

  // Tự động cuộn xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Lưu lịch sử vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    if (!courseId || !isLoaded) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY(courseId), JSON.stringify(messages));
    } catch (_) {}
  }, [messages, courseId, isLoaded]);

  const handleClearHistory = () => {
    if (!courseId) return;
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY(courseId));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !courseId) return;

    const userMessage = { role: "user", text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`/api/ai/course/${courseId}/ask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ question: input })
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.answer || "Tôi không thể trả lời câu hỏi này lúc này.", timestamp: new Date().toISOString() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Lỗi kết nối đến trợ lý AI.", timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-header: message count + clear button */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {messages.length} tin nhắn
          </span>
          <button
            onClick={handleClearHistory}
            title="Xoá lịch sử"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Trash2 size={12} />
            Xoá lịch sử
          </button>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10 opacity-60">
            <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center text-blue-600 mb-2">
              <Sparkles size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900">UniLearn AI Assistant</p>
              <p className="text-xs font-bold text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                Tôi có thể giúp bạn giải đáp kiến thức, tóm tắt bài giảng hoặc giải bài tập.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
               {["Tóm tắt bài này", "Giải thích khái niệm", "Bài tập thực hành"].map((hint, i) => (
                 <button key={i} onClick={() => setInput(hint)} className="px-3 py-1.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
                   {hint}
                 </button>
               ))}
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
            m.role === "user" ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all",
              m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200" 
                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none markdown-content"
            )}>
              {m.role === "ai" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              ) : m.text}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
              {m.role === "user" ? "Bạn" : "AI Assistant"}
              {m.timestamp && (
                <span className="ml-1 normal-case font-medium">
                  · {new Date(m.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col gap-2 items-start animate-pulse">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Bạn muốn hỏi gì về bài học này?..."
            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner group-hover:border-slate-200"
          />
          <button 
            onClick={handleSendMessage}
            className="absolute right-3 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 font-bold mt-4 tracking-tight">
          AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}
