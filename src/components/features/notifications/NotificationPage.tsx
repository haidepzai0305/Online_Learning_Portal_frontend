import { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  Info, 
  AlertTriangle, 
  CreditCard, 
  BookOpen,
  MailOpen
} from "lucide-react";
import notificationService from "../../../services/notificationService";
import { toast } from "react-hot-toast";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.listNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông báo");
    }
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("payment") || t.includes("thanh toán")) return <CreditCard className="text-emerald-500" />;
    if (t.includes("assignment") || t.includes("bài tập")) return <BookOpen className="text-blue-500" />;
    if (t.includes("announcement") || t.includes("thông báo")) return <Info className="text-amber-500" />;
    return <Bell className="text-indigo-500" />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 px-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                <Bell size={24} />
              </span>
              Thông báo của tôi
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Bạn có {notifications.filter(n => !n.is_read).length} thông báo chưa đọc</p>
          </div>
          
          <button 
            onClick={() => toast.success("Đã đánh dấu tất cả là đã đọc")}
            className="text-sm font-bold text-[#6366f1] hover:text-indigo-700 transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Đọc tất cả
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-[#6366f1] rounded-full animate-spin" />
              <p className="text-slate-400 font-bold">Đang cập nhật thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailOpen size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hộp thư trống</h3>
              <p className="text-slate-500 font-medium">Hiện tại bạn không có thông báo nào mới.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => !n.is_read && markRead(n.id)}
                className={`group relative bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  n.is_read ? "border-slate-100 opacity-75" : "border-indigo-100 bg-indigo-50/10 shadow-sm"
                }`}
              >
                <div className="flex gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    n.is_read ? "bg-slate-50" : "bg-white shadow-sm border border-indigo-50"
                  }`}>
                    {getIcon(n.title)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-base font-bold ${n.is_read ? "text-slate-600" : "text-slate-900"}`}>
                        {n.title}
                      </h4>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock size={12} />
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${n.is_read ? "text-slate-400" : "text-slate-600 font-medium"}`}>
                      {n.message}
                    </p>
                  </div>

                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 absolute top-4 right-4" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
