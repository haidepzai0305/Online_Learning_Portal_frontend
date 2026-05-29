import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, List, Settings, Eye, GripVertical, Check, ArrowRight } from "lucide-react";
import { cn } from "../../../../lib/utils";
import toast from "react-hot-toast";
import courseService from "../../../../services/courseService";

const courseSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả cần chi tiết hơn (ít nhất 20 ký tự)"),
  price: z.string().min(1, "Vui lòng nhập giá"),
  category: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const STEPS = [
  { id: "basic", label: "Thông tin cơ bản", icon: List },
  { id: "curriculum", label: "Chương trình (Tree-view)", icon: List },
  { id: "preview", label: "Cài đặt & X.Trước", icon: Settings },
];

export default function CourseBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = (data: CourseFormValues) => {
    setCourseData(data);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const handlePublish = async () => {
    if (!courseData) return;
    setLoading(true);
    try {
      await courseService.createCourse({
        ...courseData,
        price: parseFloat(courseData.price),
        category: courseData.category || "backend" // Default for now
      });
      toast.success("Khóa học đã được xuất bản thành công!");
      window.location.href = "/portal/instructor/builder"; // Reset or go to list
    } catch (err) {
      toast.error("Lỗi khi xuất bản khóa học.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Trình Tạo Khóa Học</h1>
        <p className="mt-2 text-slate-400">Xây dựng chương trình học tuyệt vời với công cụ đa bước.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 before:bg-white/10 before:z-0">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-[#07111f] px-2">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                isActive ? "border-cyan-400 bg-cyan-400/10 text-cyan-400" : isPast ? "border-emerald-400 bg-emerald-400 text-slate-900" : "border-slate-700 bg-[#0B1524] text-slate-500"
              )}>
                {isPast ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={cn("text-xs font-bold", isActive ? "text-cyan-400" : isPast ? "text-emerald-400" : "text-slate-500")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0B1524]/80 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.form
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Tiêu đề khóa học</label>
                <input
                  {...register("title")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-cyan-400 focus:outline-none"
                  placeholder="Vd: Advanced Go Backend"
                />
                {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Mô tả chi tiết</label>
                <textarea
                  {...register("description")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-cyan-400 focus:outline-none min-h-[120px]"
                  placeholder="Khóa học này sẽ dạy về..."
                />
                {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Giá vé (VND)</label>
                <input
                  {...register("price")}
                  type="number"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-cyan-400 focus:outline-none"
                  placeholder="500000"
                />
                {errors.price && <p className="mt-1 text-xs text-rose-400">{errors.price.message}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-400">
                  Tiếp theo
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.form>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Chương trình giảng dạy</h3>
                  <p className="text-sm text-slate-400">Thêm bài học và sắp xếp bằng kéo thả (Drag & Drop)</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20">
                  <Plus size={16} /> Chương mới
                </button>
              </div>

              <div className="space-y-4">
                {/* Empty state for curriculum */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
                   <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-3">
                      <List size={20} />
                   </div>
                   <p className="text-sm text-slate-400">Chưa có nội dung chương trình học.</p>
                   <button className="mt-4 flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300">
                      <Plus size={16} /> Tạo chương mới ngay
                   </button>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/10">
                <button onClick={() => setCurrentStep(0)} className="rounded-xl px-6 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">
                  Quay lại
                </button>
                <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-400">
                  Tiếp theo
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 p-10 text-center flex flex-col items-center">
                 <div className="h-16 w-16 bg-cyan-500/20 text-cyan-400 flex items-center justify-center rounded-full mb-4">
                    <Eye size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-white">Bạn đã sẵn sàng Xuất Bản?</h2>
                 <p className="mt-2 text-slate-400 max-w-md">Kiểm tra hiển thị của khóa học bạn với góc nhìn người học trước khi live hoàn toàn lên hệ thống.</p>
                 
                 <div className="mt-8 flex gap-4">
                    <button className="rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/5 transition">
                      Preview UI
                    </button>
                    <button 
                      onClick={handlePublish}
                      disabled={loading}
                      className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-slate-900 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition disabled:opacity-50"
                    >
                      {loading ? "Đang xử lý..." : "🔥 Publish Khóa Học"}
                    </button>
                 </div>
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentStep(1)} className="rounded-xl px-6 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">
                  Quay lại
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
