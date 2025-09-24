// src/components/DashboardPage/Product/ProductLayout.jsx
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Edit, Trash } from "lucide-react";

export default function ProductLayout() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [adding, setAdding] = useState(false);

const fetchProducts = async () => {
  try {
    const res = await api.get("/products");
    console.log("API /products response:", res.data);

    const data = res.data?.data?.products || [];
    setProducts(data);
    setFiltered(data);
  } catch (err) {
    console.error("Fetch products failed:", err?.response?.data ?? err);
    setProducts([]);
    setFiltered([]);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // lọc theo search, tag, store
  useEffect(() => {
    let data = [...products];
    if (search) {
      data = data.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedTag) {
      data = data.filter((p) =>
        p.tags?.some((t) => t.category === selectedTag)
      );
    }
    if (selectedStore) {
      data = data.filter((p) => p.tags?.some((t) => t.store === selectedStore));
    }
    setFiltered(data);
  }, [search, selectedTag, selectedStore, products]);

  const formatPrice = (num) =>
    new Intl.NumberFormat("vi-VN").format(num) + " VND";

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả tags</option>
          {[...new Set(products.flatMap((p) => p.tags?.map((t) => t.category)))]
            .filter(Boolean)
            .map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>

        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả người đăng</option>
          {[...new Set(products.flatMap((p) => p.tags?.map((t) => t.store)))]
            .filter(Boolean)
            .map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
        </select>

        <button
          onClick={() => setAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-4 py-3 font-semibold text-gray-600 border-b">
          <div>Sản phẩm</div>
          <div>Giá</div>
          <div>Người đăng</div>
          <div>Trạng thái</div>
          <div className="text-center">Hành động</div>
        </div>

        {filtered.map((p) => (
          <div
            key={p._id}
            className="grid grid-cols-5 gap-4 px-4 py-3 items-center border-b hover:bg-gray-50"
          >
            {/* Sản phẩm */}
            <div className="flex items-center gap-3">
              <img
                src={p.img?.[0] || "https://via.placeholder.com/50"}
                alt="product"
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <div className="font-medium">{p.productName}</div>
                <div className="text-sm text-gray-500">
                  {p.tags?.[0]?.category || "Không có tag"}
                </div>
              </div>
            </div>

            {/* Giá */}
            <div>{formatPrice(p.price)}</div>

            {/* Người đăng */}
            <div>{p.tags?.[0]?.store || "N/A"}</div>

            {/* Trạng thái */}
          <div>
  {p.quantity === 0 ? (
    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
      Hết hàng
    </span>
  ) : (
    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
      Còn {p.quantity} sản phẩm
    </span>
  )}
</div>




            {/* Hành động */}
            <div className="flex gap-3 justify-center">
              <button onClick={() => setEditing(p)}>
                <Edit className="w-5 h-5 text-blue-500 hover:text-blue-700" />
              </button>
              <button onClick={() => setDeleting(p)}>
                <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popups */}
      {editing && <div>Popup chỉnh sửa (demo)</div>}
      {deleting && <div>Popup xác nhận xóa (demo)</div>}
     {adding && (
  <div className="fixed inset-0 bg-transparent flex items-center justify-center">
    {/* Overlay đen mờ, click để đóng modal */}
    <div
      className="absolute inset-0 bg-black bg-opacity-50"
      onClick={() => setAdding(false)}
    />

    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const formData = {
              productName: e.target.productName.value,
              price: Number(e.target.price.value),
              quantity: Number(e.target.quantity.value),
              description: e.target.description.value,
              img: [e.target.img.value],
            };

            const res = await api.post("/products", formData);
            console.log("Thêm sản phẩm thành công:", res.data);

            setAdding(false);
            fetchProducts(); // refresh danh sách
          } catch (err) {
            console.error(
              "Thêm sản phẩm thất bại:",
              err?.response?.data ?? err
            );
            alert("Thêm sản phẩm thất bại!");
          }
        }}
        className="space-y-4"
      >
        <input
          name="productName"
          placeholder="Tên sản phẩm"
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          name="price"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="Giá"
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          name="quantity"
          type="number"
          inputMode="numeric"
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
          placeholder="Link ảnh (tạm thời)"
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setAdding(false)}
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
)}


    </div>
  );
}
