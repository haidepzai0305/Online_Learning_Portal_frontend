import { Star, Clock, Users } from "lucide-react";

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

export function CourseCard({ course }: CourseCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLevelStyles = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const discountPercent = course.originalPrice
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getLevelStyles(course.level)}`}>
          {course.level}
        </span>
        {discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 group-hover:text-teal-600 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-xs sm:text-sm mb-2">{course.instructor}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <span className="text-yellow-600 font-bold text-xs sm:text-sm">{course.rating.toFixed(1)}</span>
          <div className="flex">{renderStars(course.rating)}</div>
          <span className="text-gray-400 text-xs">({course.reviewCount.toLocaleString()})</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
          <div className="flex items-center gap-1">
            <Clock size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-teal-600 font-bold text-sm sm:text-lg">{formatPrice(course.price)}</span>
          {course.originalPrice && course.originalPrice > course.price && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">{formatPrice(course.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;