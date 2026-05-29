import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  Folder,
  Star,
  MessageCircle,
} from "lucide-react";
import { loadHomeScreenData, mockHomeScreenData } from "../home/home.data";
import type { HomeCatalogData } from "../home/home.types";

type SortMode = "popular" | "rating" | "price-low" | "price-high";

export function CourseCatalogPage() {
  const [catalogData, setCatalogData] = useState<HomeCatalogData>(mockHomeScreenData.catalog);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchTerm, setSearchTerm] = useState(query);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const homeData = await loadHomeScreenData(query, activeCategory);
        setCatalogData(homeData.catalog);
      } catch (error) {
        console.error("Failed to fetch catalog data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, activeCategory]);

  const handleApplyFilter = () => {
    setSearchParams({ q: searchTerm, category: activeCategory });
  };

  const sortedCourses = useMemo(() => {
    const sorted = [...catalogData.courses];
    switch (sortMode) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default: // popular
        sorted.sort((a, b) => (b.students || 0) - (a.students || 0));
    }
    return sorted;
  }, [catalogData.courses, sortMode]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-['Inter',_sans-serif] pt-[72px]">
      {/* Header Section */}
      <div className="w-full bg-[#0ea5e9] py-12 px-4 sm:px-6 text-white">
        <div className="mx-auto max-w-[1340px]">
          <h1 className="text-3xl font-black mb-1">
            {query ? `Kết quả tìm kiếm: "${query}"` : "Khám phá khóa học"}
          </h1>
          <p className="text-blue-50 text-sm font-medium">{catalogData.courses.length} khóa học được tìm thấy</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">

          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
              <div>
                <h3 className="text-[15px] font-black text-slate-700 mb-4">Danh mục</h3>


                {/* Category List */}
                <div className="flex flex-col gap-0.5">

                  {catalogData.categories
                    .filter(cat => cat.name !== "Tất cả")
                    .map((cat: any) => {
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setActiveCategory(cat.id);
                            // Clear search query when a specific category is clicked
                            setSearchParams({ q: "", category: cat.id });
                          }}
                          className={`group flex items-center justify-between px-2 py-2.5 rounded-xl transition-all ${activeCategory === cat.id ? "bg-slate-50" : "hover:bg-slate-50/50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Folder size={18} className="text-slate-400 stroke-[1.5]" />
                            <span className={`text-[14px] ${activeCategory === cat.id ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                              {cat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-slate-400">({cat.count || 0})</span>
                            <ChevronDown size={14} className="text-slate-400" />
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-black text-slate-700 mb-4">Sắp xếp</h3>
                <div className="relative">
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] font-medium text-slate-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="price-low">Giá: Thấp đến Cao</option>
                    <option value="price-high">Giá: Cao đến Thấp</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={18} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 pt-2">
                <button
                  onClick={handleApplyFilter}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-black text-[15px] shadow-lg shadow-blue-500/20 hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  Áp dụng bộ lọc
                </button>
                <button
                  onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div>
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500">Hiển thị {sortedCourses.length} / {sortedCourses.length} khóa học</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Thumbnail & Badge */}
                  <div className="relative aspect-video">
                    <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
                    <div className="absolute top-3 right-3 bg-blue-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-wider">
                      {course.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 leading-snug h-[44px] overflow-hidden mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4 shrink-0 overflow-hidden">
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">{course.instructor} | </p>
                      <div className="flex gap-1.5">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-600">DevOps</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-600">GenAI</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-black text-amber-500">{course.rating.toFixed(1)}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < Math.floor(course.rating) ? "fill-current" : ""} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">({(course.students || 0).toLocaleString()})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-blue-600 line-clamp-1">{new Intl.NumberFormat("vi-VN").format(course.price)}đ</span>
                        {course.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">{new Intl.NumberFormat("vi-VN").format(course.originalPrice)}đ</span>
                        )}
                      </div>
                      {course.originalPrice && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-black">
                          -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-xs tracking-widest hover:brightness-110 transition-all">
                      THÊM VÀO GIỎ HÀNG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-blue-100 text-xs font-bold text-slate-700 animate-bounce">
          Bạn muốn học gì hôm nay? 🎓
        </div>
        <button className="w-16 h-16 rounded-full bg-blue-500 shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all relative">
          <MessageCircle size={32} />
          <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold">1</div>
        </button>
      </div>
    </div>
  );
}

export default CourseCatalogPage;
