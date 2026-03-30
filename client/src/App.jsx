import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { AdminPage } from "./pages/AdminPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAppContext } from "./context/AppContext";

function AuthOnly({ children }) {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminOnly({ children }) {
  const { user } = useAppContext();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/profile"
          element={
            <AuthOnly>
              <ProfilePage />
            </AuthOnly>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthOnly>
              <AdminOnly>
                <AdminPage />
              </AdminOnly>
            </AuthOnly>
          }
        />
      </Route>
    </Routes>
  );
}
