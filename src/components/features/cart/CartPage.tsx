import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, PackageOpen, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../../context/CartContext";
import { CourseCard } from "../../UI/CourseCard";
import { courseService } from "../../../services/courseService";
import paymentService from "../../../services/paymentService";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "zalopay" | "paypal" | "vietqr">("momo");
  const [showQrPopup, setShowQrPopup] = useState(false);

  if (cartItems.length === 0) {
    return (
      <section className="bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 h-full min-h-screen">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <PackageOpen size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Giỏ hàng của bạn đang trống</h2>
          <p className="mt-3 max-w-sm text-slate-500 leading-relaxed">
            Bạn chưa chọn khóa học nào. Hãy quay lại danh mục để tìm kiếm những khóa học tuyệt vời nhé.
          </p>
          <Link
            to="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(6,182,212,0.25)] transition-all hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-[0_10px_25px_rgba(6,182,212,0.35)]"
          >
            <ShoppingCart size={18} />
            Khám phá khóa học
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 h-full min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-600">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Checkout</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Giỏ hàng của bạn</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:gap-12">
          {/* Cột Danh sách sản phẩm giống DisplaySection / Course Catalog */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">
              Khóa học đã chọn ({cartItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cartItems.map((course) => (
                <div key={course.id} className="relative group">
                  <CourseCard course={course} />
                  <button
                    onClick={() => removeFromCart(course.id)}
                    className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Đơn hàng (Order Summary) */}
          <aside>
            <div className="sticky top-24 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="text-xl font-black text-slate-900">Thông tin đơn hàng</h2>

              <div className="mt-6 space-y-4">
                {cartItems.map((course) => (
                  <div key={course.id} className="flex justify-between gap-4 border-b border-slate-100 pb-4">
                    <span className="text-sm font-medium text-slate-600 line-clamp-2 flex-1">
                      {course.title}
                    </span>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      {formatPrice(course.price)}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-6">
                <div>
                  <div className="text-sm text-slate-500">Tổng cộng</div>
                  <div className="mt-1 text-xs text-slate-400">Đã bao gồm VAT</div>
                </div>
                <div className="text-3xl font-black tracking-[-0.03em] text-cyan-500">
                  {formatPrice(totalPrice)}đ
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex h-14 w-24 items-center justify-center rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${paymentMethod === 'momo' ? 'border-pink-500 bg-pink-50 shadow-md shadow-pink-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                    alt="MoMo"
                    className="h-8 w-8 object-contain"
                    onError={(e: any) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-pink-500">MoMo</span>'; }}
                  />
                </button>
                <button
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`flex h-14 w-24 items-center justify-center rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${paymentMethod === 'vietqr' ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/VietQR_logo.svg/1024px-VietQR_logo.svg.png"
                    alt="VietQR"
                    className="h-5 w-auto object-contain"
                    onError={(e: any) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-indigo-600">VietQR</span>'; }}
                  />
                </button>
                <button
                  onClick={() => setPaymentMethod('zalopay')}
                  className={`flex h-14 w-24 items-center justify-center rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${paymentMethod === 'zalopay' ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/ZaloPay_Logo.png/640px-ZaloPay_Logo.png"
                    alt="ZaloPay"
                    className="h-8 w-auto object-contain"
                    onError={(e: any) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-blue-500">ZaloPay</span>'; }}
                  />
                </button>
              </div>

              <button onClick={() => {
                if (!localStorage.getItem("access_token")) {
                  toast.error("Vui lòng đăng nhập để thanh toán");
                  navigate("/auth");
                  return;
                }
                setShowQrPopup(true);
              }} className="mt-8 w-full flex items-center justify-center gap-2 rounded-[20px] bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-2xl">
                <ShoppingCart size={18} />
                Tiến hành thanh toán
              </button>

              <div className="mt-6 text-center text-xs text-slate-400">
                Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của UniLearn.
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showQrPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowQrPopup(false)} className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <X size={20} />
            </button>

            <h3 className="mb-2 text-2xl font-black text-slate-900">
              Thanh toán {paymentMethod.toUpperCase()}
            </h3>
            <p className="mb-6 text-sm text-slate-500">Quét mã QR để hoàn tất đơn hàng ({formatPrice(totalPrice)}đ)</p>

            <div className={`mx-auto mb-6 flex aspect-square w-52 items-center justify-center rounded-2xl border-4 p-2 shadow-inner bg-white ${paymentMethod === 'momo' ? 'border-pink-500' : paymentMethod === 'vietqr' ? 'border-indigo-600' : 'border-blue-500'}`}>
              <div className="text-center w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                <img
                  src={`https://img.vietqr.io/image/MB-0979100856-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(`${paymentMethod.toUpperCase()} PAY UNILEARN`)}&accountName=UniLearn%20Academy`}
                  alt="QR Thanh toán"
                  className="w-full h-full object-contain mix-blend-multiply"
                  onLoad={(e: any) => e.target.style.opacity = '1'}
                  onError={(e: any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`Chuyen khoan ${totalPrice} cho UniLearn`)}`; }}
                />
              </div>
            </div>

            <button
              onClick={async () => {
                const loadingToast = toast.loading("Đang khởi tạo giao dịch...");
                try {
                  // 1. Initiate Checkout for each course (or bulk if backend supports, currently I use single)
                  for (const item of cartItems) {
                    const checkoutRes = await paymentService.initiateCheckout(Number(item.id), paymentMethod);
                    console.log("Checkout initiated:", checkoutRes);

                    // 2. Simulate Success immediately (Normally this is a separate webhook)
                    // We call our internal simulateSuccess or the webhook API
                    await paymentService.simulateSuccess(checkoutRes.transaction_id);
                  }

                  toast.dismiss(loadingToast);
                  setShowQrPopup(false);
                  clearCart?.();
                  toast.success("Thanh toán thành công! Khóa học đã được kích hoạt.");

                  // Redirect to Order History to see the result
                  navigate("/portal/student/orders");
                } catch (err: any) {
                  console.error("Payment flow failed:", err);
                  toast.dismiss(loadingToast);
                  toast.error("Giao dịch thất bại. Vui lòng thử lại.");
                }
              }}
              className={`w-full rounded-xl py-4 font-black text-white transition-all hover:brightness-110 active:scale-95 ${paymentMethod === 'momo' ? 'bg-pink-500' : paymentMethod === 'vietqr' ? 'bg-indigo-600' : 'bg-blue-500'}`}
            >
              Xác nhận đã thanh toán
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
