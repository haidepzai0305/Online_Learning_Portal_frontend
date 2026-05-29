import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { getTokenExpiration } from "./utils/jwt";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthPage from "./components/features/Auth/AuthPage";
import { CourseCatalogPage } from "./components/features/courses/CourseCatalogPage";
import { CourseDetailPage } from "./components/features/courses/CourseDetailPage";
import { HomeScreen } from "./components/features/home/HomeScreen";
import CartPage from "./components/features/cart/CartPage";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import PortalLayout from "./components/layout/PortalLayout";
import InstructorOverview from "./components/features/dashboard/instructor/InstructorOverview";
import InstructorCourses from "./components/features/dashboard/instructor/InstructorCourses";
import CourseBuilder from "./components/features/dashboard/instructor/CourseBuilder";
import QAManagement from "./components/features/dashboard/instructor/QAManagement";
import StudentOverview from "./components/features/dashboard/student/StudentOverview";
import StudentOrders from "./components/features/dashboard/student/StudentOrders";
import NotificationPage from "./components/features/notifications/NotificationPage";
import CourseLearningPage from "./components/features/courses/CourseLearningPage";
import ProfilePage from "./components/features/profile/ProfilePage";
import { CartProvider } from "./context/CartContext";

const MarketingLayout = ({ userName, onLogout, isAuthenticated }: { userName: string, onLogout: () => void, isAuthenticated: boolean }) => (
  <>
    <Header userName={userName} onLogout={onLogout} isAuthenticated={isAuthenticated} />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("access_token"));
  const [userName, setUserName] = useState(() => localStorage.getItem("user_name") ?? "User");

  // Quản lý Timer tự động Logout
  useEffect(() => {
    let logoutTimer: number | undefined;

    if (isAuthenticated) {
      const token = localStorage.getItem("access_token");
      if (token) {
        const expirationTime = getTokenExpiration(token);
        if (expirationTime) {
          const delay = expirationTime - Date.now();
          
          if (delay > 0) {
            console.log(`DEBUG: Token will expire in ${Math.round(delay / 1000)} seconds. Auto-logout scheduled.`);
            logoutTimer = window.setTimeout(() => {
              console.log("DEBUG: Token expired. Logging out...");
              handleLogout();
              alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            }, delay);
          } else {
            // Token đã hết hạn ngay khi load app
            handleLogout();
          }
        }
      }
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage
                  onLoginSuccess={(name: string) => {
                    setIsAuthenticated(true);
                    setUserName(name);
                    localStorage.setItem("user_name", name);
                  }}
                />
              )
            }
          />

          <Route element={<MarketingLayout userName={userName} onLogout={handleLogout} isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<HomeScreen />} />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor", "admin"]}>
                  <CourseCatalogPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/:courseId" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor"]}>
                  <CourseDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor", "admin"]}>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Account Settings Pages (No Sidebar, uses Marketing Header) */}
            <Route 
              path="/portal/instructor/settings" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["professor", "admin"]}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portal/student/settings" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "admin", "professor"]}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Student My Courses Page (No Sidebar) */}
            <Route 
              path="/portal/student" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "admin", "professor"]}>
                  <StudentOverview />
                </ProtectedRoute>
              } 
            />
            {/* Student Orders Page (No Sidebar) */}
            <Route 
              path="/portal/student/orders" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "admin", "professor"]}>
                  <StudentOrders />
                </ProtectedRoute>
              } 
            />
            {/* Instructor My Courses Page (No Sidebar) */}
            <Route 
              path="/portal/instructor/courses" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["professor", "admin"]}>
                  <InstructorCourses />
                </ProtectedRoute>
              } 
            />
            {/* Global Notifications Page (No Sidebar) */}
            <Route 
              path="/portal/notifications" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor", "admin"]}>
                  <NotificationPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Sidebar-based Dashboard Pages */}
          {isAuthenticated && (
            <>
              <Route
                path="/portal"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor"]}>
                    <PortalLayout />
                  </ProtectedRoute>
                }
              >
                {/* Dành cho Giảng viên */}
                <Route
                  path="instructor"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["professor", "admin"]}>
                      <Outlet />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<InstructorOverview />} />
                  <Route path="builder" element={<CourseBuilder />} />
                  <Route path="qa" element={<QAManagement />} />
                </Route>
              </Route>

              {/* Full Screen Learning Page (Outside PortalLayout) */}
              <Route 
                path="/portal/student/learning/:courseId" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "admin", "professor"]}>
                    <CourseLearningPage />
                  </ProtectedRoute>
                } 
              />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
