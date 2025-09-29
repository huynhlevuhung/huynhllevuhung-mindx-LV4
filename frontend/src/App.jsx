import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// ✅ React Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ShopContextProvider from "./context/ShopContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Authen from "./pages/Authen";
import Test from "./pages/Test";
import ForgotPassword from "./pages/ForgotPassword";
import MyAccount from "./pages/MyAccount";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import ChangePassword from "./pages/ChangePassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import DashboardPage from "./pages/DashboardPage"; // admin
import SellerPage from "./pages/SellerPage";       // seller
import Home from "./pages/Home";                   // user & landing

// 🔒 Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");

  if (!token) return <Navigate to="/authen/login" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
};

// ✅ Tạo QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopContextProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/detail" element={<ProductDetail />} />

          {/* Auth routes */}
          <Route path="/authen" element={<Authen />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* User account routes */}
          <Route
            path="/myaccount/*"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          >
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<Address />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Seller dashboard */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerPage />
              </ProtectedRoute>
            }
          />

          {/* Test route */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </ShopContextProvider>
    </QueryClientProvider>
  );
}

export default App;
