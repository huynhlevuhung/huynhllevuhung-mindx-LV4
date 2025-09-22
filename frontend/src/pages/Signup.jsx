import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import { useEffect, useState } from "react";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import SpinnerLoad from "../components/Spinner";
import InputOTP from "../components/InputOTP";
import CountdownTimer from "../components/CountDownTimer";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LeftArrowIcon,
} from "../icons/icons";

export default function Signup() {
  const [showResend, setShowResend] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");
  const [openOtp, setOpenOtp] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (openOtp) {
      setShowResend(false);
      const timer = setTimeout(() => {
        setShowResend(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [openOtp]);

  const navigate = useNavigate();

  const toast = useToast();

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
      await api.post("/users/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
      });
      toast.success("Đăng ký thành công", "Vui lòng xác thực tài khoản");
      setOpenOtp(true);
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/resend-otp", {
        email: form.email,
      });
      toast.success("OTP đã được gửi lại", "Vui lòng kiểm tra lại email.");
      setResetTimer((k) => k + 1);
      setShowResend(false);
    } catch (err) {
      toast.error(
        "Có lỗi xảy ra",
        err.response?.data?.message || "Không thể gửi lại OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/users/verify-otp", {
        email: form.email,
        otp,
      });
      toast.success("Đăng ký thành công", "Bạn có thể đăng nhập ngay");
      navigate("/login");
    } catch (err) {
      setOtpError(true);

      toast.error("Có lỗi xảy ra", err.response.data.message);
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
        {!openOtp ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Đăng ký tài khoản
            </h2>
            <Input
              label="Username"
              name="username"
              placeholder="congbang1234"
              value={form.username}
              onChange={handleChange}
              error=""
            />
            <Input
              label="Email"
              name="email"
              placeholder="you@example.com"
              type="email"
              value={form.email}
              onChange={handleChange}
              error=""
            />
            <div className="relative">
              <Input
                label="Mật khẩu"
                name="password"
                placeholder="••••••••"
                type={!isVisible1 ? "password" : "text"}
                value={form.password}
                onChange={handleChange}
                error=""
              />

              {isVisible1 ? (
                <EyeSlashFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible1(!isVisible1)}
                />
              ) : (
                <EyeFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible1(!isVisible1)}
                />
              )}
            </div>
            <div className="relative">
              <Input
                label="Xác nhận mật khẩu"
                name="passwordConfirm"
                placeholder="••••••••"
                type={!isVisible2 ? "password" : "text"}
                value={form.passwordConfirm}
                onChange={handleChange}
                error=""
              />

              {isVisible2 ? (
                <EyeSlashFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible2(!isVisible2)}
                />
              ) : (
                <EyeFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible2(!isVisible2)}
                />
              )}
            </div>
            {isloading ? (
              <button
                className=" flex justify-center gap-3 cursor-not-allowed w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 "
                disabled={true}
              >
                <SpinnerLoad />
                <p>Đang đăng ký</p>
              </button>
            ) : (
              <button
                type="submit"
                className="cursor-pointer w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Đăng ký
              </button>
            )}
            <p className="text-sm text-gray-600 text-center">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Xác thực tài khoản
              </h2>
              <div
                onClick={() => {
                  setOtp("");
                  setOpenOtp(false);
                }}
                className="absolute left-0 top-1 rounded-md 
               hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>

            <p className="text-gray-600">
              OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và
              nhập mã để xác thực tài khoản.
            </p>
            <div className="flex justify-center">
              <InputOTP
                isInvalid={otpError}
                onChange={setOtp}
                value={otp}
                onValueChange={(val) => {
                  setOtp(val);
                  if (otpError) setOtpError(false);
                }}
                onComplete={handleVerifyOtp}
              />
            </div>
            <div className="flex items-center justify-center">
              <p>Thời gian còn lại: </p>
              <CountdownTimer resetTrigger={resetTimer} />
            </div>

            {showResend && (
              <div>
                {!isloading ? (
                  <p className="text-center d text-gray-600">
                    Không nhận được mã?{" "}
                    <span
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleResendOtp}
                      className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
                    >
                      Gửi lại OTP
                    </span>
                  </p>
                ) : (
                  <div className="flex justify-center gap-2 items-center">
                    <SpinnerLoad color="primary" />
                    <p className=" text-gray-600">Đang gửi lại OTP</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </form>
    </FadeContent>
  );
}
