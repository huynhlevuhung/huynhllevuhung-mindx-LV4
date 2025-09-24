import { useState } from "react";

export default function AddUserModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    phone: "",
    role: "user",
  });

  const [errorMessage, setErrorMessage] = useState(""); // 🔹 state báo lỗi

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async () => {
  try {
    setErrorMessage(""); // reset lỗi cũ
    await onConfirm(formData); // gọi UserLayout
    onClose(); // đóng modal nếu thành công
  } catch (err) {
    setErrorMessage(
      err?.response?.data?.message || "Thêm người dùng thất bại"
    );
  }
};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Thêm người dùng</h2>

        {/* 🔹 hiển thị lỗi */}
        {errorMessage && (
  <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-3">
    {errorMessage}
  </div>
)}

        <div className="space-y-3">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Họ tên"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="shipper">Shipper</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
