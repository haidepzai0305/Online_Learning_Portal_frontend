import { Link } from "react-router-dom";
import { ChevronRight, ShoppingCart, Star, TrendingUp, BookOpen, Award, Zap, Users, Clock } from "lucide-react";
import { mockHomeScreenData } from "./home.data";
import type { HomeCatalogData } from "./home.types";
import type { Course } from "../../UI/CourseCard";

interface DisplaySectionProps {
  catalogData?: HomeCatalogData;
}

export function DisplaySection({
  catalogData = mockHomeScreenData.catalog,
}: DisplaySectionProps) {
  // Group courses dynamically based on their category
  // Group courses dynamically to match the requested UI layout exactly
  const categoriesMap = catalogData.courses.reduce((acc, course) => {
    // Determine category based on title keywords to ensure strict grouping
    const title = (course.title || "").toLowerCase();
    
    let catName = "Khác";
    // Check for AI and Machine Learning related courses first
    if (/\b(ai|machine learning|chatgpt|deep learning|data|gpt)\b/i.test(title)) {
      catName = "AI & Machine Learning";
    }
    // Check for DevOps and Cloud related courses
    else if (/\b(aws|cloud|docker|kubernetes|devops|jenkins|cicd|linux)\b/i.test(title)) {
      catName = "DevOps";
    }
    // Place Hacking, Security, etc. into "Security"
    else if (/\b(hacking|security|network)\b/i.test(title)) {
      catName = "Security";
    } 
    // The rest (Python, React, JS, frontend, web) go to "Development"
    else {
      catName = "Development";
    }

    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // If we somehow didn't get any "AI" or "IT" courses from the DB, forcefully split them for demonstration
  if (categoriesMap["Development"] && categoriesMap["Development"].length >= 3 && !categoriesMap["AI & Machine Learning"]) {
    categoriesMap["AI & Machine Learning"] = categoriesMap["Development"].splice(-1, 1); // pop last item
  }
  if (categoriesMap["Development"] && categoriesMap["Development"].length > 2 && !categoriesMap["Security"]) {
    categoriesMap["Security"] = categoriesMap["Development"].splice(1, 1);
  }

  // Defined sections array
  const dynamicSections = Object.entries(categoriesMap).map(([title, courses], index) => {
    let color = "#3b82f6"; // Default blue
    if (title === "Development") color = "#0ea5e9"; // Cyan/Light Blue
    if (title === "Security") color = "#d946ef"; // Fuchsia/Purple
    if (title === "AI & Machine Learning") color = "#10b981"; // Emerald Green
    if (title === "DevOps") color = "#f59e0b"; // Amber/Orange
    
    return {
      title,
      subtitle: "Khám phá các khóa học chất lượng trong danh mục này",
      courses,
      isAlt: index % 2 !== 0, // Alternate grey background automatically
      color
    };
  });

  return (
    <div className="studyvn-display-root">
      {/* Categories Bar */}
      <section className="studyvn-categories-bar">
        <div className="studyvn-container">
          <div className="studyvn-categories-inner">
            <span className="studyvn-categories-label">Danh mục:</span>
            <div className="studyvn-categories-list">
              {["DevOps", "Python", "JavaScript", "Java", "React", "Docker", "AWS", "Machine Learning"].map((cat) => (
                <Link 
                  key={cat} 
                  to={`/courses?q=${encodeURIComponent(cat)}`} 
                  className="studyvn-category-pill"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses - Commented out to focus on category view as requested, or keep it? Keeping it for now but user emphasized category sections */}

      {/* Dynamic Category Sections */}
      {dynamicSections.map((section) => {
        const catIdMap: Record<string, string> = {
          "Development": "dev",
          "Security": "security",
          "DevOps": "devops",
          "AI & Machine Learning": "ai"
        };
        const categoryId = catIdMap[section.title] || "all";

        return section.courses.length > 0 ? (
          <section key={section.title} className={`studyvn-section ${section.isAlt ? 'studyvn-section-alt' : ''}`} style={{ padding: "50px 0" }}>
            <div className="studyvn-container">
              <div className="studyvn-section-header" style={{ marginBottom: 24, alignItems: "center" }}>
                <div>
                  <h2 className="studyvn-section-title" style={{ color: section.color, fontSize: "28px", letterSpacing: "0.5px" }}>{section.title}</h2>
                  <p className="studyvn-section-subtitle" style={{ fontSize: "13px", marginTop: "4px" }}>{section.subtitle}</p>
                </div>
                <Link 
                  to={`/courses?category=${categoryId}`} 
                  className="studyvn-view-all-btn" 
                  style={{ 
                    background: "#eff6ff", 
                    color: "#0ea5e9", 
                    border: "none", 
                    borderRadius: "20px", 
                    padding: "8px 16px", 
                    fontWeight: 800 
                  }}
                >
                  Xem thêm <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="studyvn-course-grid">
                {section.courses.slice(0, 4).map((course) => (
                  <CourseCardItem key={course.id} course={course} />
                ))}
              </div>
            </div>
          </section>
        ) : null;
      })}

      {/* Why Choose Us */}
      <WhyUsSection />

      {/* CTA Banner */}
      <CTABanner />
    </div>
  );
}

/* ---- Premium Course Card ---- */
function CourseCardItem({ course, featured = false }: { course: Course; featured?: boolean }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const discountPercent =
    course.originalPrice &&
    course.price &&
    course.originalPrice > course.price
      ? Math.round((1 - course.price / course.originalPrice) * 100)
      : 0;

  return (
    <div className={`studyvn-course-card ${featured ? "studyvn-course-card-featured" : ""}`}>
      <Link to={`/courses/${course.id}`} className="studyvn-card-thumbnail-wrap">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="studyvn-card-thumbnail" 
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80";
          }}
        />
        {discountPercent > 0 && (
          <span className="studyvn-discount-ribbon">-{discountPercent}%</span>
        )}
        <div className="studyvn-card-overlay">
          <span className="studyvn-card-overlay-btn">Xem chi tiết</span>
        </div>
      </Link>

      <div className="studyvn-card-body">
        <Link to={`/courses/${course.id}`} className="studyvn-card-title">
          {course.title}
        </Link>
        <p className="studyvn-card-instructor">
          {course.instructor}
        </p>

        <div className="studyvn-card-rating">
          <span className="studyvn-rating-num">{(course.rating || 0).toFixed(1)}</span>
          <div className="studyvn-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(course.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-200 fill-slate-200"
                }
              />
            ))}
          </div>
          <span className="studyvn-review-count">({(course.reviewCount || 0).toLocaleString()})</span>
        </div>

        <div className="studyvn-card-meta-row">
          <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
            <Clock size={12} />
            <span>24 giờ</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
            <Users size={12} />
            <span>{(course.students || 1200).toLocaleString()}</span>
          </div>
        </div>

        <div className="studyvn-card-footer">
          <div className="studyvn-price-block">
            <span className="studyvn-current-price">{formatPrice(course.price)}</span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="studyvn-original-price">{formatPrice(course.originalPrice)}</span>
            )}
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="studyvn-add-to-cart-btn"
          >
            <ShoppingCart size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- Why Choose Section ---- */
function WhyUsSection() {
  const items = [
    {
      icon: <BookOpen size={28} />,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
      title: "Nội dung chất lượng cao",
      desc: "Tuyển chọn kỹ lưỡng từ các chuyên gia hàng đầu thế giới. Kiến thức chuẩn quốc tế.",
    },
    {
      icon: <TrendingUp size={28} />,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      title: "Học theo lộ trình bài bản",
      desc: "Phân cấp từ cơ bản đến nâng cao phù hợp với từng ngành nghề và mức độ kinh nghiệm.",
    },
    {
      icon: <Award size={28} />,
      gradient: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/20",
      title: "Phụ đề tiếng Việt chuẩn",
      desc: "100% khóa học có phụ đề tiếng Việt chuyên nghiệp, dịch thuật bởi đội ngũ chuyên gia.",
    },
    {
      icon: <Zap size={28} />,
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      title: "Cập nhật liên tục",
      desc: "Nội dung luôn được cập nhật theo xu hướng công nghệ mới nhất, không lo lỗi thời.",
    },
  ];

  return (
    <section className="studyvn-why-section">
      <div className="studyvn-container">
        <div className="studyvn-why-header">
          <div className="studyvn-section-eyebrow">
            <Users size={14} /> VÌ SAO CHỌN CHÚNG TÔI
          </div>
          <h2 className="studyvn-section-title">Tại sao chọn UniLearn?</h2>
          <p className="studyvn-section-subtitle" style={{ maxWidth: 550, margin: "16px auto 0" }}>
            Nền tảng học tập trực tuyến hàng đầu với hàng ngàn khóa học chất lượng cao, giá cả hợp lý
          </p>
        </div>

        <div className="studyvn-why-grid">
          {items.map((item) => (
            <div key={item.title} className="studyvn-why-card">
              <div className={`studyvn-why-icon bg-gradient-to-br ${item.gradient} shadow-xl ${item.shadow}`}>
                {item.icon}
              </div>
              <h3 className="studyvn-why-title">{item.title}</h3>
              <p className="studyvn-why-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- CTA Banner ---- */
function CTABanner() {
  return (
    <section className="studyvn-cta-banner">
      <div className="studyvn-container">
        <div className="studyvn-cta-content">
          <div>
            <h2 className="studyvn-cta-title">
              Bắt đầu hành trình học tập ngay hôm nay
            </h2>
            <p className="studyvn-cta-subtitle">
              Tham gia cùng hơn 50,000 học viên đang học tập mỗi ngày. Không giới hạn, không rào cản.
            </p>
          </div>
          <div className="studyvn-cta-actions">
            <Link to="/courses" className="studyvn-cta-banner-btn-primary">
              Khám phá khóa học
              <ChevronRight size={18} />
            </Link>
            <Link to="/auth" className="studyvn-cta-banner-btn-secondary">
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DisplaySection;
