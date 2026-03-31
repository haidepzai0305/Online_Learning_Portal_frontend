// Component bảo vệ Route theo Role
export default function ProtectedRoute({
  children,
  allowedRoles,
  isAuthenticated
}: {
  children: JSX.Element;
  allowedRoles: string[];
  isAuthenticated: boolean;
}) {
  const userRole = localStorage.getItem("user_role");

  // 1. Nếu chưa đăng nhập -> về trang Auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Nếu đã đăng nhập nhưng sai Role -> về trang chủ (hoặc trang báo lỗi)
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 3. Hợp lệ thì cho qua
  return children;
}