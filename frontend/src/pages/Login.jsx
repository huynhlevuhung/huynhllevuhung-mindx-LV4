import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import Cookies from "js-cookie";

import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import SpinnerLoad from "../components/Spinner";
import { Checkbox } from "@heroui/checkbox";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons/icons";
import { ShopContext } from "../context/ShopContext";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useContext(ShopContext); // ✅ lấy hàm login từ context

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
  const res = await api.post("/auth/login", {
    identifier: form.username, // đúng field BE yêu cầu
    password: form.password,
  });

  console.log("LOGIN RESPONSE:", res.data);

  const user = res.data.data?.user; // lấy user đúng cấu trúc
  const token = res.data.token;     // nếu BE trả token thì lấy ở đây, nếu không thì bỏ

  // Lưu token vào cookie nếu có
  if (token) {
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
  }

  // Lưu role vào cookie để ProtectedRoute check
  if (user?.role) {
    Cookies.set("role", user.role, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
  }

  // Lưu vào context
  login(user);

  toast.success("Đăng nhập thành công");

  // ✅ Điều hướng theo role
  if (user.role === "admin") {
    navigate("/admin");
  } else if (user.role === "seller") {
    navigate("/seller");
  } else {
    navigate("/");
  }
} catch (err) {
  const msg = err.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
  toast.error(msg);
  console.log("Login error:", err.response?.data || err.message);
} finally {
  setIsLoading(false);
}

  };

  return (
    <FadeContent
      blur={true}
      duration={800}
      easing="ease-out"
      initialOpacity={0}
      className="flex items-center justify-center pr-12 mr-20 ml-12 w-full max-w-md"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Đăng nhập tài khoản
        </h2>

        <Input
          label="Username"
          name="username"
          placeholder="congbang1234"
          value={form.username}
          onChange={handleChange}
        />

        <div className="relative">
          <Input
            label="Mật khẩu"
            name="password"
            placeholder="••••••••"
            type={!isVisible ? "password" : "text"}
            value={form.password}
            onChange={handleChange}
          />
          {isVisible ? (
            <EyeSlashFilledIcon
              className="cursor-pointer absolute bottom-3 right-4"
              onClick={toggleVisibility}
            />
          ) : (
            <EyeFilledIcon
              className="cursor-pointer absolute bottom-3 right-4"
              onClick={toggleVisibility}
            />
          )}
        </div>

        <div className="font-semibold text-gray-800">
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </div>

        {isLoading ? (
          <button
            className="flex justify-center gap-3 cursor-not-allowed w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 opacity-80"
            disabled
          >
            <SpinnerLoad /> <p>Đang đăng nhập</p>
          </button>
        ) : (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        )}

        <p className="text-sm text-blue-600 text-center hover:underline cursor-pointer">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </p>
        <p className="text-sm text-gray-600 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/authen/signup" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </FadeContent>
  );
}
