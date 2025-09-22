import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import { useState } from "react";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import SpinnerLoad from "../components/Spinner";
import { Checkbox } from "@heroui/checkbox";

import { Link, useNavigate } from "react-router-dom";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons/icons";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const toast = useToast();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await api.post("/users/login", {
      username: form.username,
      password: form.password,
    });

    // Lưu token + role vào localStorage
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("role", res.data.data.user.role);

    toast.success("Đăng nhập thành công");
    navigate("/dashboard");
  } catch (err) {
    // ✅ Không dùng console.error (tránh log đỏ trong F12)
    const msg = err.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
    toast.error(msg);

    // Nếu muốn log nhẹ cho dev thì dùng console.log (màu trắng, không đỏ)
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
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Đăng nhập tài khoản
          </h2>

          <Input
            label="Username"
            name="username"
            placeholder="congbang1234"
            value={form.username}
            onChange={handleChange}
            error=""
          />

          <div className="relative">
            <Input
              label="Mật khẩu"
              name="password"
              placeholder="••••••••"
              type={!isVisible ? "password" : "text"}
              value={form.password}
              onChange={handleChange}
              error=""
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

          {isloading ? (
            <button
              className=" flex justify-center gap-3 cursor-not-allowed w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 "
              disabled={true}
            >
              <SpinnerLoad />
              <p>Đang đăng nhập</p>
            </button>
          ) : (
            <button
              type="submit"
              className="cursor-pointer w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          )}
          <p className="text-sm text-blue-600 text-center hover:underline cursor-pointer">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
          <p className="text-sm text-gray-600 text-center">
            Chưa có tài khoản?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Đăng ký
            </Link>
          </p>
        </>
      </form>
    </FadeContent>
  );
}
