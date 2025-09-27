// src/components/DashboardPage/Product/ProductLayout.jsx
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Edit, Trash } from "lucide-react";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

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

      const data = res.data?.data || [];
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

  // Lọc theo search, tag, store
  useEffect(() => {
    let data = [...products];
    if (search) {
      data = data.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
   if (selectedTag) {
  data = data.filter((p) =>
    p.tags?.some((t) => t.nameTag === selectedTag)
  );
}
    if (selectedStore) {
      data = data.filter((p) => p.store?._id === selectedStore);
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
          <option value="">Tất cả loại</option>
         {[...new Set(products.flatMap((p) => p.tags?.map((t) => t.nameTag)))]
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
          <option value="">Tất cả cửa hàng</option>
          {[...new Map(products.map((p) => [p.store?._id, p.store?.name]))].map(
            ([id, name]) =>
              id && (
                <option key={id} value={id}>
                  {name}
                </option>
              )
          )}
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
                src={p.img?.[0] || "https://png.pngtree.com/png-clipart/20230418/original/pngtree-products-line-icon-png-image_9065446.png"}
                alt="product"
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <div className="font-medium">{p.productName}</div>
                <div className="text-sm text-gray-500">
  {p.tags?.[0]?.nameTag || "Không có tag"}
</div>
              </div>
            </div>

            {/* Giá */}
            <div>{formatPrice(p.price)}</div>

            {/* Người đăng */}
            <div>{p.store?.name || "N/A"}</div>

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
      <AddProductModal
        open={adding}
        onClose={() => setAdding(false)}
        onSuccess={fetchProducts}
         products={products} 
      />


      <EditProductModal
        product={editing}
        onClose={() => setEditing(null)}
        onSuccess={fetchProducts}
      />

      <DeleteProductModal
        product={deleting}
        onClose={() => setDeleting(null)}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
