import { useState, useEffect } from "react";
import api from "@/utils/api";

export default function EditProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    quantity: 0,
    description: "",
    img: [""],
    tags: [], // ✅ sửa từ object -> array string
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        description: product.description || "",
        img: product.img?.length ? product.img : [""],
        tags: product.tags || [], // đảm bảo luôn là array string
      });
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // nếu input tags là chuỗi -> tách thành array string
        tags:
          typeof formData.tags === "string"
            ? formData.tags.split(",").map((t) => t.trim())
            : formData.tags,
      };

      await api.put(`/products/${product._id}`, payload);
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Cập nhật sản phẩm thất bại:", err?.response?.data ?? err);
      alert("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa sản phẩm</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Tên sản phẩm"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="img"
            value={formData.img?.[0] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                img: [e.target.value],
              }))
            }
            placeholder="Link ảnh"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* ✅ sửa input tags thành chuỗi, parse khi submit */}
          <input
            name="tags"
            value={formData.tags.join(", ")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((t) => t.trim()),
              }))
            }
            placeholder="Danh mục (tag), cách nhau bằng dấu phẩy"
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
