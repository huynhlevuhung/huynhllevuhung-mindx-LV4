import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { setShowSearch, getCartCount, user, logout } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const handleCartClick = () => {
    if (!user) {
      navigate("/authen/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md font-medium relative">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          className="w-36" // giữ kích thước logo file 2
          alt="Trendify"
        />
      </Link>

      {/* Menu */}
      <ul className="hidden gap-6 text-sm text-gray-700 sm:flex">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6 relative">
        {/* Search */}
       <div
  className="flex items-center gap-2 relative"
  onMouseEnter={() => setSearchOpen(true)}
  onMouseLeave={() => setSearchOpen(false)}
>
  {/* Input */}
  <input
    type="text"
    placeholder="Tìm kiếm sản phẩm..."
    className={`h-8 px-3 rounded-full border outline-none text-sm transition-all duration-300
      ${searchOpen ? "w-48 opacity-100" : "w-0 opacity-0"} `}
    onFocus={() => setShowSearch(true)}
    onBlur={() => setShowSearch(false)}
  />

  {/* Icon search */}
  <img
    src={assets.search_icon}
    className="w-5 cursor-pointer transition-all duration-300"
    alt="Search Products"
  />
</div>

        {/* User / Profile */}
        <div className="relative group">
          {!user ? (
            <>
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer"
                alt="Login"
              />
              <div className="absolute right-0 hidden pt-4 group-hover:block dropdown-menu">
                <div className="flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100">
                  <Link
                    to="/authen/login"
                    className="cursor-pointer hover:text-black"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/authen/signup"
                    className="cursor-pointer hover:text-black"
                  >
                    Đăng Ký
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src={
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3106/3106773.png"
                }
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                alt="User Avatar"
              />
              <div className="absolute right-0 hidden pt-4 group-hover:block dropdown-menu">
                <div className="flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100">
                  <Link
                    to="/profile"
                    className="cursor-pointer hover:text-black"
                  >
                    Thông tin
                  </Link>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Đăng Xuất
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart */}
        <div onClick={handleCartClick} className="relative cursor-pointer">
          <img
            src={assets.cart_icon}
            className="w-5 min-w-5"
            alt="Cart"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </div>

        {/* Language */}
        <div
          className="relative"
          onMouseEnter={() => setLangOpen(true)}
          onMouseLeave={() => setLangOpen(false)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/44/44386.png"
            alt="Language"
            className="w-5 cursor-pointer"
          />
          {langOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md p-2 flex flex-col gap-2 w-20 text-center">
              <button
                className="hover:opacity-80"
                onClick={() => console.log("Set VN")}
              >
                🇻🇳
              </button>
              <button
                className="hover:opacity-80"
                onClick={() => console.log("Set EN")}
              >
                🇺🇸
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu Icon"
        />
      </div>

      {/* Sidebar menu for smaller screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="Dropdown"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
