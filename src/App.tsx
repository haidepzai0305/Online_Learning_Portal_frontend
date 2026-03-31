import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/features/Auth/AuthPage";
import { HomeScreen } from "./components/features/Home/HomeScreen";
import { HeroSection } from "./components/features/home/HeroSection";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userProgress, setUserProgress] = useState(65);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <AuthPage onLoginSuccess={(name: string) => {
                  setIsAuthenticated(true);
                  setUserName(name);
                }} />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor"]}>
              <HomeScreen userName={userName} onLogout={() => setIsAuthenticated(false)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated
              ? <HomeScreen userName={userName} onLogout={handleLogout} progress={userProgress}/>
              : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/manage-courses"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["professor"]}>
              <div className="text-white">Trang quản lý dành cho Giáo sư</div>
            </ProtectedRoute>
          }
        />
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;