import { Star, Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  duration: string;
  students: number;
  price: number;
  originalPrice?: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface CourseCardProps {
  course: Course;
}

const CAT_MAP: Record<string, string> = {
  "dev": "Development",
  "security": "Security",
  "devops": "DevOps",
  "ai": "AI & Machine Learning",
  "data": "Data Science",
  "mobile": "Mobile Development"
};

export function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const discountPercent = (course.originalPrice && course.price && course.originalPrice > course.price)
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  const displayCategory = CAT_MAP[course.category.toLowerCase()] || course.category;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80";
          }}
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold text-indigo-600 uppercase tracking-wider shadow-sm border border-white/50">
            {displayCategory}
          </span>
        </div>

        {/* Level Tag */}
        {course.level && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-tight",
              course.level === "Advanced" ? "bg-rose-500" : course.level === "Intermediate" ? "bg-amber-500" : "bg-emerald-500"
            )}>
              {course.level}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <ChevronRight className="text-indigo-600 ml-0.5" size={20} />
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title */}
        <h3 className="text-[15px] font-bold text-slate-800 leading-tight mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-[13px] text-slate-500 font-medium mb-3">
          {course.instructor}
        </p>

        {/* Metrics */}
        <div className="flex items-center gap-3 mb-4 text-[12px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3">
            <Clock size={14} className="text-slate-300" />
            <span>{course.duration || "12h"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-slate-300" />
            <span>{(course.students || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Area: Rating & Price */}
        <div className="mt-auto space-y-3">
            {/* Rating */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-[14px] font-black text-slate-800">{(course.rating || 0).toFixed(1)}</span>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                                key={i}
                                size={12}
                                className={cn(
                                    "fill-yellow-400 text-yellow-400",
                                    i > Math.round(course.rating || 4.7) && "fill-slate-100 text-slate-100"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[11px] text-slate-400 ml-1">({(course.reviewCount || 0).toLocaleString()})</span>
                </div>
            </div>

            {/* Price Line */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex flex-col">
                    <span className="text-[18px] font-black text-indigo-600 leading-none">
                        {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-[11px] text-slate-400 line-through mt-1">
                            {formatPrice(course.originalPrice)}
                        </span>
                    )}
                </div>
                {discountPercent > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black">
                        -{discountPercent}%
                    </span>
                )}
            </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
