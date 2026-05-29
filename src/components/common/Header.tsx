import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Award,
  Bell,
  Book,
  Box,
  ChevronDown,
  ChevronRight,
  Folder,
  LogOut,
  Menu,
  ShoppingCart,
  User,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function Header({
  userName,
  onLogout,
  isAuthenticated,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>("dev");
  const [searchValue, setSearchValue] = useState("");

  const subCategoriesData: Record<string, string[]> = {
    dev: [
      "Front-end (React, Vue, Next.js)",
      "Back-end (Node.js, Java, Python)",
      "Mobile Development (Flutter, iOS)",
      "Full-stack Web Development",
      "Game Development (Unity, Unreal)",
      "Data Science & Analytics",
      "Software Engineering & PM",
      "Low-code & No-code Platform"
    ],
    security: [
      "Ethical Hacking (White Hat)",
      "Web Application Security",
      "Network Defense & Firewall",
      "SOC Analyst & Incident Response",
      "Pentesting & Vulnerability",
      "Cloud Security (AWS/Azure)",
      "Digital Forensics",
      "Cybersecurity Principles"
    ],
    devops: [
      "Cloud Computing (AWS/Azure/GCP)",
      "Containers & Docker",
      "Kubernetes & Orchestration",
      "CI/CD Automation (Jenkins/GitLab)",
      "Infrastructure as Code (IaC)",
      "Linux System Administration",
      "Monitoring & Observability",
      "Site Reliability Engineering (SRE)"
    ],
    ai: [
      "Machine Learning Engineering",
      "Deep Learning Foundations",
      "Computer Vision & Media",
      "Natural Language Processing (NLP)",
      "Generative AI & LLM (GPT)",
      "Big Data & MLOps",
      "AI for Business & Leadership",
      "Reinforcement Learning"
    ]
  };

  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const role = localStorage.getItem("user_role") || "student";
  const storedName = localStorage.getItem("user_name");
  const resolvedName = userName || storedName || "Học viên";

  // The header is now white globally to match the reference design
  const theme = "light";

  const UserMenuBtn = ({ icon, label, onClick, color = "#64748b" }: { icon: any, label: string, onClick?: () => void, color?: string }) => (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        color: "#475569",
        fontSize: 14,
        fontWeight: 600,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.color = "#818cf8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#475569";
      }}
    >
      <div style={{ color }}>{icon}</div>
      {label}
    </button>
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchValue(q);
    } else {
      setSearchValue("");
    }
  }, [location.search]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 100,
        width: "100%",
        transition: "all 0.3s ease",
      }}
    >
      {/* Top Promo Bar */}
      <div style={{
        background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
        color: "#ffffff",
        padding: "8px 0",
        textAlign: "center",
        fontSize: "12px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        position: "relative"
      }}>
        <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "4px" }}>Ưu đãi trong tuần</span>
        <span>Nhập mã <strong style={{ color: "#fbbf24" }}>UD50</strong> giảm 50k cho đơn từ 300k!</span>
        <button style={{ position: "absolute", right: "20px", background: "none", border: "none", color: "#ffffff", cursor: "pointer", opacity: 0.7 }}>×</button>
      </div>

      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #e2e8f0",
          background: isScrolled ? "rgba(255, 255, 255, 0.98)" : "#ffffff",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "all 0.3s ease",
        }}
      >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
        }}
      >
        {/* Left: Logo & Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link
            to="/"
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: theme === "light" ? "#0f172a" : "#ffffff",
              textDecoration: "none",
              letterSpacing: "-0.5px",
            }}
          >
            Uni
            <span style={{ color: "#818cf8" }}>Learn</span>
          </Link>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
            className="hidden-mobile"
          >
            <div 
              ref={menuRef} 
              style={{ position: "relative" }}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0ea5e9", // Matching the blue theme
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s",
                }}
              >
                <Menu size={18} strokeWidth={2.5} />
                Danh mục
                <ChevronDown
                  size={14}
                  style={{
                    transform: isMenuOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    marginLeft: 2
                  }}
                  strokeWidth={3}
                />
              </button>

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "calc(100% + 15px)",
                  minWidth: 640, // Increased width for sub-menu
                  display: "flex",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? "translateY(0)" : "translateY(-12px)",
                  pointerEvents: isMenuOpen ? "auto" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden"
                }}
              >
                {/* Left Panel: Main Categories */}
                <div style={{
                  width: 300,
                  padding: "12px 10px",
                  borderRight: "1px solid #f1f5f9",
                  background: "#ffffff"
                }}>
                  {/* Lộ trình học featured item */}
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 16,
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "#f8fafc",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginBottom: 8,
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#eff6ff";
                      setHoveredCategory(null);
                    }}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}>
                      <Box size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Lộ trình học</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Theo ngành nghề</p>
                    </div>
                    <ChevronRight size={14} color="#cbd5e1" />
                  </button>

                  <div style={{ height: 1, background: "#f1f5f9", margin: "8px 6px" }} />

                  {/* Categories List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      { id: "dev", name: "Development" },
                      { id: "security", name: "Security" },
                      { id: "devops", name: "DevOps" },
                      { id: "ai", name: "AI & Machine Learning" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onMouseEnter={() => setHoveredCategory(c.id)}
                        onClick={() => {
                          navigate(`/courses?category=${c.id}`);
                          setIsMenuOpen(false);
                        }}
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          gap: 14,
                          padding: "12px 14px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: hoveredCategory === c.id ? "#3b82f6" : "#334155",
                          borderRadius: 10,
                          background: hoveredCategory === c.id ? "#f8fafc" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          textAlign: "left",
                        }}
                      >
                        <Folder size={18} color={hoveredCategory === c.id ? "#3b82f6" : "#94a3b8"} />
                        <span style={{ flex: 1 }}>{c.name}</span>
                        <ChevronRight size={14} color={hoveredCategory === c.id ? "#3b82f6" : "#e2e8f0"} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Sub-Categories */}
                <div style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#fcfdfe",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 400
                }}>
                  {hoveredCategory && subCategoriesData[hoveredCategory] ? (
                    <>
                      <h4 style={{ margin: "4px 0 12px 0", fontSize: 15, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {hoveredCategory === "dev" ? "Software Development" : hoveredCategory.toUpperCase()}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
                        {subCategoriesData[hoveredCategory].map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(`/courses?q=${sub}`);
                              setIsMenuOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 12px",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#475569",
                              background: "transparent",
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#3b82f6";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#475569";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <span style={{ color: "#cbd5e1" }}>└─</span> {sub}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", textAlign: "center", padding: 40 }}>
                      <Box size={48} opacity={0.2} style={{ marginBottom: 16 }} />
                      <p style={{ fontSize: 14, fontWeight: 500 }}>Rê chuột vào một danh mục để xem chi tiết các khóa học</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#475569",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = theme === "light" ? "#0f172a" : "#ffffff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = theme === "light" ? "#475569" : "#cbd5e1")
              }
            >
              Trang chủ
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div
          className="hidden-mobile"
          style={{
            display: "flex",
            position: "relative",
            flex: "1",
            maxWidth: 420,
            margin: "0 32px",
          }}
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Nhập từ khoá bạn quan tâm hoặc tên khoá học..."
            style={{
              width: "100%",
              borderRadius: 10,
              background: theme === "light" ? "#f1f5f9" : "rgba(255,255,255,0.06)",
              border: theme === "light" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.08)",
              padding: "10px 100px 10px 16px",
              fontSize: 13,
              color: theme === "light" ? "#0f172a" : "#ffffff",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#818cf8")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = theme === "light" ? "#e2e8f0" : "rgba(255,255,255,0.08)")
            }
          />
          <button
            onClick={handleSearch}
            style={{
              position: "absolute",
              right: 4,
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: 8,
              background: "#0188d1",
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 700,
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#0277bd")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#0188d1")
            }
          >
            Tìm kiếm
          </button>
        </div>

        {/* Right: Cart & Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            to="/cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 10,
              background: theme === "light" ? "rgba(1, 136, 209, 0.05)" : "rgba(255,255,255,0.06)",
              padding: "8px 14px",
              color: theme === "light" ? "#0188d1" : "#cbd5e1",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              border: theme === "light" ? "1px solid rgba(1, 136, 209, 0.1)" : "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme === "light" ? "rgba(1, 136, 209, 0.1)" : "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme === "light" ? "rgba(99, 102, 241, 0.05)" : "rgba(255,255,255,0.06)";
            }}
          >
            <ShoppingCart size={17} />
            Giỏ hàng
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  right: -8,
                  top: -8,
                  display: "flex",
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#6366f1",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#ffffff",
                  border: theme === "light" ? "2px solid #ffffff" : "2px solid #07111f",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <Link
              to="/portal/notifications"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(99, 102, 241, 0.08)",
                color: "#6366f1",
                transition: "all 0.2s",
                position: "relative"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)")}
            >
              <Bell size={18} />
              <span style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                background: "#f43f5e",
                borderRadius: "50%",
                border: "2px solid #ffffff"
              }}></span>
            </Link>
          )}

          {!isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                to="/auth"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme === "light" ? "#475569" : "#cbd5e1",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme === "light" ? "#0f172a" : "#ffffff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme === "light" ? "#475569" : "#cbd5e1")
                }
              >
                Đăng ký
              </Link>
              <Link
                to="/auth"
                style={{
                  borderRadius: 10,
                  background: "#6366f1",
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4f46e5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#6366f1")
                }
              >
                Đăng nhập
              </Link>
            </div>
          ) : (
            <div 
              style={{ position: "relative" }}
              ref={menuRef}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 16px",
                  borderRadius: 10,
                  background: isUserMenuOpen ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
                  border: isUserMenuOpen ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.2)",
                  color: "#6366f1",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  display: "flex",
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#6366f1",
                  color: "#ffffff"
                }}>
                  <User size={12} />
                </div>
                {resolvedName}
                <ChevronDown size={14} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* User Dropdown Menu */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 280,
                  background: "#ffffff",
                  borderRadius: 20,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                  border: "1px solid #f1f5f9",
                  padding: "16px",
                  opacity: isUserMenuOpen ? 1 : 0,
                  transform: isUserMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  pointerEvents: isUserMenuOpen ? "auto" : "none",
                  transition: "all 0.25s ease",
                  zIndex: 200,
                }}
              >
                <div style={{ padding: "0 8px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontWeight: 800, color: "#1e293b", fontSize: 15 }}>{resolvedName}</div>
                  <div style={{ fontWeight: 500, color: "#94a3b8", fontSize: 13, wordBreak: "break-all" }}>{localStorage.getItem("user_email") || "hainguyen22032005@gmail.com"}</div>
                </div>

                <div style={{ padding: "12px 0" }}>
                  <UserMenuBtn 
                    icon={<Book size={18} />} 
                    label="Khóa học của tôi" 
                    onClick={() => {
                      navigate(role === "professor" ? "/portal/instructor/courses" : "/portal/student");
                      setIsUserMenuOpen(false);
                    }}
                  />
                  <UserMenuBtn 
                    icon={<Bell size={18} />} 
                    label="Thông báo" 
                    onClick={() => {
                      navigate("/portal/notifications");
                      setIsUserMenuOpen(false);
                    }} 
                  />
                  <UserMenuBtn 
                    icon={<ShoppingCart size={18} />} 
                    label="Lịch sử thanh toán" 
                    onClick={() => {
                      navigate("/portal/student/orders");
                      setIsUserMenuOpen(false);
                    }} 
                  />
                  <UserMenuBtn 
                    icon={<User size={18} />} 
                    label="Tài khoản" 
                    onClick={() => {
                      navigate(role === "professor" ? "/portal/instructor/settings" : "/portal/student/settings");
                      setIsUserMenuOpen(false);
                    }}
                  />
                  <UserMenuBtn 
                    icon={<Award size={18} />} 
                    label="Hợp tác kiếm tiền" 
                    color="#f59e0b"
                    onClick={() => {
                      navigate("/affiliate");
                      setIsUserMenuOpen(false);
                    }}
                  />
                </div>

                <div style={{ paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      color: "#ef4444",
                      fontSize: 14,
                      fontWeight: 700,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);
}

