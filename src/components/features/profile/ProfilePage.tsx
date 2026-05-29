import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const name = localStorage.getItem("user_name") || "Nguyễn Đăng Hải";
  const email = localStorage.getItem("user_email") || "hainguyen22032005@gmail.com";

  const [formData, setFormData] = useState({
    fullName: name,
    phone: "0979100856",
    email: email
  });

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cập nhật thông tin thành công!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đổi mật khẩu thành công!");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-28 pb-16 px-4 font-sans">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] mb-8">Tài khoản của tôi</h1>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* LEFT - Profile Card */}
          <aside>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              {/* Avatar */}
              <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-[#1a1a2e] text-lg mb-1">{name}</h2>
              <p className="text-slate-400 text-[13px] font-medium mb-6">{email}</p>

              <div className="space-y-3 pt-5 border-t border-slate-100 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Khóa học đã mua</span>
                  <span className="font-bold text-slate-900">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tổng đơn hàng</span>
                  <span className="font-bold text-slate-900">1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tổng chi tiêu</span>
                  <span className="font-bold text-[#6366f1]">100.000đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ngày tham gia</span>
                  <span className="font-bold text-slate-900">20/03/2026</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT - Forms */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h3 className="font-bold text-[#1a1a2e] text-[17px] mb-6">Thông tin cá nhân</h3>
              <form onSubmit={handleUpdateInfo} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-600 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-600 mb-2">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 bg-slate-50 cursor-not-allowed"
                  />
                  <p className="text-[12px] text-slate-400 mt-1.5">Email không thể thay đổi</p>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                >
                  Cập nhật thông tin
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h3 className="font-bold text-[#1a1a2e] text-[17px] mb-6">Đổi mật khẩu</h3>
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Mật khẩu hiện tại</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Mật khẩu mới</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white"
                  />
                </div>
                <label className="flex items-center gap-2 w-fit cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 accent-[#6366f1]"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="text-[13px] font-semibold text-slate-600">Hiện mật khẩu</span>
                </label>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#1a1a2e] transition hover:bg-[#0d0d1d] active:scale-[0.98]"
                >
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
