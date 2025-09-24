import React, { useState, useEffect } from "react";

const UpdateUserModal = ({ user, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onConfirm(user._id, formData); // gọi hàm từ UserLayout
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={onClose} // click ra ngoài sẽ đóng modal
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // ngăn click trong modal bị đóng
      >
        <h2 className="text-lg font-semibold mb-4">Cập nhật người dùng</h2>

        <div className="space-y-3">
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Họ tên"
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
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full border px-3 py-2 rounded"
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
