// src/components/Navbar.jsx
import React from "react";
import { BellIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import LanguageDropDown from "./LanguageDropDown";
import MeDropDown from "./MeDropDown";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  const languageOptions = [
    { key: "vi", label: "Tiếng Việt" },
    { key: "en", label: "English" },
  ];

  const meOptions = [
    { key: "me", label: "Tài khoản của tôi" },
    { key: "order", label: "Đơn hàng" },
    { key: "logout", label: "Đăng xuất" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 text-white">
          {/* Logo + Menu chính */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
              <img src="/assets/logo.png" className="w-12 h-12" alt="Logo" />
              <p>TMDT</p>
            </div>

            <div className="hidden md:flex gap-2 font-medium text-lg">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Trang Chủ
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Sản Phẩm
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Giới Thiệu
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Liên Hệ
              </Link>
            </div>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="flex-1 mx-6 hidden md:block">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Phần icon bên phải */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/20 transition cursor-pointer">
              <div className="relative flex items-center justify-center w-8 h-8">
                <BellIcon className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  3
                </span>
              </div>
              <span className="text-white font-medium">Thông báo</span>
            </div>

            <LanguageDropDown options={languageOptions} defaultValue="vi" />

            {/* Menu user */}
            {user ? (
              <MeDropDown options={meOptions} />
            ) : (
              <Link
                to="/authen/login"
                className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Đăng nhập
              </Link>
            )}

            {/* Giỏ hàng */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/20 transition cursor-pointer">
              <ShoppingCartIcon className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                5
              </span>
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm cho màn hình nhỏ */}
        <div className="block md:hidden py-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
