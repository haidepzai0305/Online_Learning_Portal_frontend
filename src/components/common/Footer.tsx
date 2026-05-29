import { Link } from "react-router-dom";
import { Globe, MessageSquare, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="studyvn-footer">
      <div className="studyvn-container">
        <div className="studyvn-footer-grid">
          {/* Brand */}
          <div className="studyvn-footer-brand">
            <h3 className="studyvn-footer-logo">
              StudyVN<span>.Academy</span>
            </h3>
            <p className="studyvn-footer-desc">
              Nền tảng e-learning hàng đầu Việt Nam. Tổng hợp khóa học chất lượng
              cao đến từ các giảng viên hàng đầu trong lĩnh vực. Học dễ dàng với phụ
              đề tiếng Việt đi kèm.
            </p>
            <div className="studyvn-footer-socials">
              <a href="#" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" aria-label="Messenger">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Column 1: Khám phá */}
          <div className="studyvn-footer-column">
            <h4 className="studyvn-footer-title">Khám phá</h4>
            <ul className="studyvn-footer-links">
              <li><Link to="/courses">Tất cả khóa học</Link></li>
              <li><a href="#">Khóa học phổ biến</a></li>
              <li><a href="#">Khóa học mới nhất</a></li>
            </ul>
          </div>

          {/* Column 2: Danh mục */}
          <div className="studyvn-footer-column">
            <h4 className="studyvn-footer-title">Danh mục</h4>
            <ul className="studyvn-footer-links">
              <li><a href="#">Development</a></li>
              <li><a href="#">IT & Software</a></li>
              <li><a href="#">Marketing</a></li>
              <li><a href="#">Design</a></li>
              <li><a href="#">Photography & Video</a></li>
            </ul>
          </div>

          {/* Column 3: Liên hệ */}
          <div className="studyvn-footer-column">
            <h4 className="studyvn-footer-title">Liên hệ</h4>
            <ul className="studyvn-footer-contact">
              <li>
                <MapPin size={16} className="shrink-0" />
                <span>92/40 Duong Ba Trac, Phường Rạch Ông, Quận 8, TP. HCM</span>
              </li>
              <li>
                <Phone size={16} className="shrink-0" />
                <span>0376193338</span>
              </li>
              <li>
                <Mail size={16} className="shrink-0" />
                <span>studyvnacademy@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="studyvn-footer-bottom">
          <p className="studyvn-footer-copyright">
            © 2026 StudyVN.Academy. Tất cả quyền được bảo lưu.
          </p>
          <div className="studyvn-footer-bottom-links">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
