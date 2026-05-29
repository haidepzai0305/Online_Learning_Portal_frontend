import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Package, 
  Receipt,
  Download,
  Search,
  AlertCircle
} from "lucide-react";
import paymentService from "../../../../services/paymentService";
import { toast } from "react-hot-toast";

export default function StudentOrders() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getTransactionHistory();
      // data.transactions according to my backend view
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Không thể tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (transaction: any) => {
    toast.success(`Hệ thống đang tạo hóa đơn cho giao dịch #${transaction.id}...`);
    // Simulation: in real app, we would open a PDF link
    setTimeout(() => {
      toast.loading("Đang tải hóa đơn...", { duration: 1500 });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 px-6 font-sans">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#1e293b] flex items-center gap-3">
              <Receipt className="text-[#6366f1]" size={32} />
              Lịch sử Thanh toán
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Quản lý các giao dịch và tải hóa đơn học tập của bạn</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm mã giao dịch..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/5 outline-none transition-all w-64"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
            <button 
              onClick={fetchTransactions}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#6366f1] hover:border-[#6366f1]/30 transition-all shadow-sm"
              title="Làm mới"
            >
              <Package size={20} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng đơn hàng</p>
              <p className="text-xl font-black text-slate-800">{transactions.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thành công</p>
              <p className="text-xl font-black text-slate-800">
                {transactions.filter(t => t.status === "SUCCESS").length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chờ thanh toán</p>
              <p className="text-xl font-black text-slate-800">
                {transactions.filter(t => t.status === "PENDING").length}
              </p>
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#6366f1]/20 border-t-[#6366f1] rounded-full animate-spin" />
              <p className="text-slate-500 font-bold animate-pulse">Đang tải giao dịch...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Bắt đầu chọn những khóa học yêu thích và thanh toán để xem lịch sử ở đây!</p>
              <button 
                onClick={() => window.location.href = "/courses"}
                className="bg-[#6366f1] py-3 px-8 rounded-xl text-white font-bold hover:bg-[#4f46e5] transition-all shadow-lg shadow-indigo-200"
              >
                Khám phá khóa học
              </button>
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div key={tx.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                {/* Transaction Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                      tx.status === "SUCCESS" 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : tx.status === "FAILED"
                        ? "bg-rose-50 border-rose-100 text-rose-600"
                        : "bg-amber-50 border-amber-100 text-amber-600"
                    }`}>
                      <Receipt size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-[#1e293b] text-base">Giao dịch #{tx.id}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                          tx.status === "SUCCESS" 
                            ? "bg-emerald-500 text-white" 
                            : tx.status === "FAILED"
                            ? "bg-rose-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}>
                          {tx.status === "SUCCESS" ? "Thành công" : tx.status === "FAILED" ? "Thất bại" : "Đang chờ"}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-400 font-bold flex items-center gap-2">
                        {tx.date} <span className="text-slate-200">•</span> {tx.method} 
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right mr-4">
                      <div className="font-black text-[#6366f1] text-xl">
                        {new Intl.NumberFormat("vi-VN").format(tx.amount)}đ
                      </div>
                      <Link to={`/courses/${tx.course_id}`} className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                        Xem khóa học
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => downloadInvoice(tx)}
                        disabled={tx.status !== "SUCCESS"}
                        className={`p-3 rounded-xl transition-all shadow-sm ${
                          tx.status === "SUCCESS"
                            ? "bg-indigo-50 text-[#6366f1] hover:bg-[#6366f1] hover:text-white"
                            : "bg-slate-50 text-slate-300 cursor-not-allowed"
                        }`}
                        title="Tải hóa đơn"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === tx.id ? null : tx.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all font-bold"
                      >
                        {expandedOrder === tx.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Overlay */}
                {expandedOrder === tx.id && (
                  <div className="border-t border-slate-50 px-8 py-6 bg-slate-50/50 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#6366f1] mb-5">Thông tin đơn hàng</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">Mã hệ thống:</span>
                            <span className="text-slate-900 font-black">INV-{tx.id}-UNI</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">ID Khóa học:</span>
                            <span className="text-slate-900 font-black">#{tx.course_id}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">Phương thức:</span>
                            <span className="text-slate-900 font-black">{tx.method}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-slate-800 font-black">Tổng tiền:</span>
                            <span className="text-lg font-black text-[#6366f1]">{new Intl.NumberFormat("vi-VN").format(tx.amount)}đ</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-72 p-6 bg-white rounded-2xl border border-indigo-50 shadow-sm flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                          <FileText size={32} />
                        </div>
                        <h5 className="font-bold text-slate-800 mb-1">Hóa đơn điện tử (E-Invoice)</h5>
                        <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">Hợp lệ để kê khai thuế và làm chứng từ thanh toán doanh nghiệp.</p>
                        <button 
                          onClick={() => downloadInvoice(tx)}
                          disabled={tx.status !== "SUCCESS"}
                          className="w-full bg-[#6366f1] py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Download size={16} />
                          Tải PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Support Section */}
        <div className="mt-12 p-8 rounded-3xl bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Cần hỗ trợ về thanh toán?</h3>
            <p className="text-indigo-100 text-sm font-medium">Giao dịch của bạn chưa được kích hoạt? Đừng lo, chúng tôi ở đây hỗ trợ 24/7.</p>
          </div>
          <a href="/support" className="relative z-10 bg-white text-indigo-600 py-3 px-8 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-xl">
            Liên hệ Hỗ trợ ngay
          </a>
          
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

// Missing Link import in original file context
import { Link } from "react-router-dom";
