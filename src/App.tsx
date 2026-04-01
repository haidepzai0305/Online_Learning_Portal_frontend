import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthPage from "./components/features/Auth/AuthPage";
import { HomeScreen } from "./components/features/home/HomeScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userProgress] = useState(65);

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
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage
                onLoginSuccess={(name: string) => {
                  setIsAuthenticated(true);
                  setUserName(name);
                }}
              />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["student", "professor"]}>
              <HomeScreen userName={userName} onLogout={handleLogout} progress={userProgress} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-courses"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["professor"]}>
              <div className="text-white">Trang quan ly danh cho Giao su</div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
