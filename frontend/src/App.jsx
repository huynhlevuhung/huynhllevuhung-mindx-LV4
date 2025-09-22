import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Authen from "./pages/Authen";
import ForgotPassword from "./pages/ForgotPassword";
import MyAccount from "./pages/MyAccount";
import Profile from "./pages/Profile";

import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import SellerPage from "./pages/SellerPage";
import ShipperPage from "./pages/ShipperPage";

import { getProfile } from "./services/authService";

// Hàm chọn page theo role
const getPageByRole = (role) => {
  switch (role) {
    case "admin":
      return <DashboardPage />;
    case "user":
      return <UserPage />;
    case "seller":
      return <SellerPage />;
    case "shipper":
      return <ShipperPage />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  const [user, setUser] = useState(null);    // lưu user info
  const [loading, setLoading] = useState(true); // loading khi gọi API

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    getProfile()
      .then((data) => setUser(data))
      .catch(() => {
        // fallback nếu getProfile fail nhưng vẫn có role trong localStorage
        const role = localStorage.getItem("role");
        if (role) setUser({ role });
        else setUser(null);
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
  }, []);

  if (loading) return <div>Loading...</div>; // có thể thay bằng spinner đẹp hơn

  return (
    <Routes>
      {/* Giữ nguyên route cũ */}
      <Route path="/myaccount" element={<MyAccount />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Authen />}>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Route dashboard cho các role */}
      <Route
        path="/dashboard/*"
        element={user ? getPageByRole(user.role) : <Navigate to="/" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
