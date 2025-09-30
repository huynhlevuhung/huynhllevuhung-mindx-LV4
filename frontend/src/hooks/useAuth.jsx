import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

export default function useAuth() {
  const queryClient = useQueryClient();

  // Lấy user hiện tại
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await api.get("/users/me"); // ✅ BE: /api/users/me
      return res.data.data.user;
    },
    retry: false,
  });

  // Đăng ký
  const signup = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/signup", data);
      return res.data;
    },
  });

  // Xác thực OTP
  const verifyOtp = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/verify-otp", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });

  // Gửi lại OTP
  const resendOtp = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/resend-otp", data);
      return res.data;
    },
  });

  // Đăng nhập
  const login = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login", data);
      return res.data.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });

  // Cập nhật thông tin user (có avatar)
  const updateMe = useMutation({
    mutationFn: async (formData) => {
      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);
    },
  });

  // Đăng xuất
  const logout = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
    },
  });

  // Quên mật khẩu - gửi email
  const forgotPassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/forgot-password", data);
      return res.data;
    },
  });

  // Quên mật khẩu - gửi lại OTP
  const resendOtpForgotPassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/resend-otp-forgot-password", data);
      return res.data;
    },
  });

  // Quên mật khẩu - verify OTP
  const verifyForgotPassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/verify-forgot-password", data);
      return res.data;
    },
  });

  // Reset password
  const resetPassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/reset-password", data);
      return res.data;
    },
  });

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isError: authQuery.isError,
    signup,
    login,
    logout,
    verifyOtp,
    resendOtp,
    updateMe,
    forgotPassword,
    resendOtpForgotPassword,
    verifyForgotPassword,
    resetPassword,
  };
}
