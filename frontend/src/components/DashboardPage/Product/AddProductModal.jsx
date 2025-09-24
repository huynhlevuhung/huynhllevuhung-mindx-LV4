import { useState } from "react";
import api from "@/utils/api";

export default function AddProductModal({ open, onClose, onSuccess, products = [] }) {
  const [selectedTag, setSelectedTag] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        productName: e.target.productName.value.trim(),
        price: Number(e.target.price.value),
        quantity: Number(e.target.quantity.value),
        description: e.target.description.value.trim(),
        img: [e.target.img.value.trim()],
        tags: selectedTag ? [{ nameTag: selectedTag }] : [],
      };

      // Validate
      if (formData.price < 0) {
        alert("Giá phải lớn hơn hoặc bằng 0!");
        return;
      }
      if (!Number.isInteger(formData.quantity) || formData.quantity < 0) {
        alert("Số lượng phải là số nguyên >= 0!");
        return;
      }

      const res = await api.post("/products", formData);
      console.log("Thêm sản phẩm thành công:", res.data);

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Thêm sản phẩm thất bại:", err?.response?.data ?? err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  // Lấy danh sách tag duy nhất từ products
  const existingTags = [
    ...new Set(products.flatMap((p) => p.tags?.map((t) => t.nameTag) || [])),
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/10"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="productName"
            placeholder="Tên sản phẩm"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Giá sản phẩm"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            placeholder="Số lượng"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <textarea
            name="description"
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="img"
            placeholder="Link ảnh"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Dropdown chọn tag dựa trên products */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">-- Chọn loại --</option>
            {existingTags.length > 0 ? (
              existingTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))
            ) : (
              <option disabled>(Chưa có loại nào)</option>
            )}
          </select>

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
