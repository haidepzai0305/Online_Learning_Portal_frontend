import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Award, Zap, Download, Users, Star, Play, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="studyvn-hero">
      <div className="studyvn-hero-inner">
        
        {/* Text Content */}
        <div className="studyvn-hero-text">
          <div className="studyvn-hero-badge">
            <TrendingUp size={14} />
            Nền tảng học tập #1 tại Việt Nam
          </div>

          <h1 className="studyvn-hero-title">
            Học Online Chất Lượng Cao
            <span className="studyvn-hero-title-highlight">
              {" "}— Phụ Đề Tiếng Việt
            </span>
          </h1>

          <p className="studyvn-hero-subtitle">
            Tuyển chọn hàng ngàn khóa học từ Udemy, Coursera với phụ đề tiếng Việt 
            chất lượng cao. Giá tốt nhất, học mọi lúc mọi nơi.
          </p>

          <div className="studyvn-hero-ctas">
            <Link to="/courses" className="studyvn-cta-primary">
              Khám phá khóa học
              <ChevronRight size={18} />
            </Link>
            <button className="studyvn-cta-secondary">
              <Play size={16} fill="currentColor" />
              Xem video giới thiệu
            </button>
          </div>

          {/* Trust Stats */}
          <div className="studyvn-stats-row">
            <div className="studyvn-stat-item">
              <span className="studyvn-stat-number">10,000+</span>
              <span className="studyvn-stat-label">Khóa học</span>
            </div>
            <div className="studyvn-stat-divider" />
            <div className="studyvn-stat-item">
              <span className="studyvn-stat-number">50,000+</span>
              <span className="studyvn-stat-label">Học viên</span>
            </div>
            <div className="studyvn-stat-divider" />
            <div className="studyvn-stat-item">
              <span className="studyvn-stat-number">4.9 ★</span>
              <span className="studyvn-stat-label">Đánh giá</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Card Side */}
        <div className="studyvn-hero-visual">
          <div className="studyvn-hero-card-main">
            <div className="studyvn-hero-card-img">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format" 
                alt="Learning" 
              />
              <div className="studyvn-hero-play-btn">
                <Play size={28} fill="white" className="ml-1" />
              </div>
            </div>
            <div className="studyvn-hero-card-info">
              <div className="studyvn-hero-card-badge">🔥 Bán chạy nhất</div>
              <div className="studyvn-hero-card-title">Docker trong Một Cuối Tuần: 40 Bài Thực Hành Cho Người Học DevOps</div>
              <div className="studyvn-hero-card-meta">
                <div className="studyvn-hero-stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#facc15" className="text-yellow-400" />)}
                  <span>4.9</span>
                </div>
                <span className="studyvn-hero-price">599.000đ</span>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="studyvn-floating-badge-1">
            <Users size={18} className="text-blue-500" />
            <div>
              <div className="text-xs font-black text-slate-900">+1,200</div>
              <div className="text-[10px] text-slate-400 font-medium">Học viên mới</div>
            </div>
          </div>
          <div className="studyvn-floating-badge-2">
            <Award size={18} className="text-amber-500" />
            <div>
              <div className="text-xs font-black text-slate-900">Chứng chỉ</div>
              <div className="text-[10px] text-slate-400 font-medium">Quốc tế</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="studyvn-feature-strip">
        <div className="studyvn-feature-strip-inner">
          <FeatureItem icon={<BookOpen size={20} className="text-blue-500" />} text="Phụ đề Tiếng Việt chuyên nghiệp" />
          <div className="studyvn-strip-divider" />
          <FeatureItem icon={<Award size={20} className="text-amber-500" />} text="Khóa học tuyển chọn từ chuyên gia" />
          <div className="studyvn-strip-divider" />
          <FeatureItem icon={<Zap size={20} className="text-purple-500" />} text="Video Full HD song ngữ Anh - Việt" />
          <div className="studyvn-strip-divider" />
          <FeatureItem icon={<Download size={20} className="text-emerald-500" />} text="Học offline mọi lúc mọi nơi" />
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="studyvn-strip-item">
      {icon}
      <span>{text}</span>
    </div>
  );
}
