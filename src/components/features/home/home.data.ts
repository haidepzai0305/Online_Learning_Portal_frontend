import axiosInstance from "../../../services/axiosInstance";
import type { HomeScreenData } from "./home.types";

export const mockHomeScreenData: HomeScreenData = {
  hero: {
    userNameFallback: "User",
    searchPlaceholder: "Tìm kiếm khóa học...",
    badgeText: "Learning Platform",
    headline: "Học tập không giới hạn",
    highlightedHeadline: "với UniLearn.",
    greeting: "Chào mừng bạn quay trở lại.",
    primaryCta: "Bắt đầu",
    secondaryCta: "Khám phá",
    streakFrames: [],
    expFrames: [],
    labFrames: [],
    insightFrames: [],
    featureCards: [],
  },
  catalog: {
    categories: [
      { id: "all", name: "Tất cả" }
    ],
    courses: [],
    sections: [],
  },
  footerSocials: [],
};

export async function loadHomeScreenData(search?: string, category?: string): Promise<HomeScreenData> {
  try {
    const response = await axiosInstance.get("/courses/", {
      params: { search, category }
    });
    const { courses = [], categories = [], sections = [], total = 0 } = response.data;
    
    return {
      ...mockHomeScreenData,
      catalog: {
        ...mockHomeScreenData.catalog,
        total,
        categories: categories.length > 0 ? categories : mockHomeScreenData.catalog.categories,
        sections: sections.length > 0 ? sections : mockHomeScreenData.catalog.sections,
        courses: courses.map((c: any) => {
          const courseId = c.id?.toString() || Math.random().toString();
          // Use id to pick a consistent but varied fallback image
          const fallbackImages = [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80"
          ];
          const fallbackIdx = Math.abs(courseId.split('').reduce((a:any,b:any)=>((a<<5)-a)+b.charCodeAt(0),0)) % fallbackImages.length;

          return {
            ...c,
            id: courseId,
            title: c.title || "Khóa học không tên",
            instructor: c.instructor || "Giảng viên",
            rating: Number(c.rating || c.average_rating || 0),
            reviewCount: Number(c.reviewCount || c.review_count || 0),
            students: Number(c.students || c.student_count || c.students_count || 1200),
            price: Number(c.price || 0),
            originalPrice: Number(c.originalPrice || c.original_price || c.price || 0),
            level: c.level || "Beginner",
            duration: c.duration || "24h",
            category: c.category || "Development",
            thumbnail: c.thumbnail_url || c.thumbnail || c.thumb || c.image || fallbackImages[fallbackIdx]
          };
        })
      }
    };
  } catch (error) {
    console.error("Failed to load home screen data from API", error);
    return mockHomeScreenData;
  }
}
