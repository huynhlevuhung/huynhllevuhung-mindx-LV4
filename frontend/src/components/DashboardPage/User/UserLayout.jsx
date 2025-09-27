// src/layouts/UserLayout.jsx
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Edit, Trash } from "lucide-react";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";

export default function UserLayout() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const usersPerPage = 10;
  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/1144/1144760.png";

  // 🔹 Lấy danh sách user từ BE
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      console.log("API /users response:", res.data);

      const data = res.data?.data?.users || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Fetch users failed:", err?.response?.data ?? err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Lấy unique role + province từ data
  const roles = [...new Set(users.map((u) => u.role).filter(Boolean))];
  const provinces = [...new Set(users.map((u) => u.province).filter(Boolean))];

  // 🔹 Search + filter
  useEffect(() => {
    let data = [...users];

    if (search) {
      data = data.filter((u) =>
        u.fullname?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedRole) {
      data = data.filter((u) => u.role === selectedRole);
    }

    if (selectedProvince) {
      data = data.filter((u) => u.province === selectedProvince);
    }

    setFilteredUsers(data);
    setCurrentPage(1);
  }, [search, selectedRole, selectedProvince, users]);

  // Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 🔹 Update role
  const handleRoleChange = async (userId, newRole, oldRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Update role failed:", err);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: oldRole } : u))
      );
    }
  };

  // 🔹 Delete user
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeletingUser(null);
    } catch (err) {
      console.error("Xóa user thất bại:", err?.response?.data ?? err);
    }
  };

  // 🔹 Update user info
  const handleUpdateUser = async (id, data) => {
    try {
      const res = await api.patch(`/users/${id}`, data);
      const updatedUser = res.data?.data?.user;

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? updatedUser : u))
      );

      setEditingUser(null);
    } catch (err) {
      console.error("Cập nhật user thất bại:", err?.response?.data ?? err);
    }
  };

  // 🔹 Add user
  const handleAddUser = async (data) => {
    try {
      const res = await api.post("/users", data);
      const newUser = res.data?.data?.user;

      setUsers((prev) => [...prev, newUser]);
      setAddingUser(false);
    } catch (err) {
      console.error("Thêm user thất bại:", err?.response?.data ?? err);
      throw err;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Tất cả vai trò</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Tất cả tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={() => setAddingUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Thêm người dùng
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 font-semibold text-gray-600 border-b">
          <div>Người dùng</div>
          <div>Liên hệ</div>
          <div>Vai trò</div>
          <div>Địa chỉ</div>
          <div className="col-span-2 text-center">Hành động</div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-6 text-center">Đang tải...</div>
        ) : Array.isArray(currentUsers) && currentUsers.length > 0 ? (
          currentUsers.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-6 gap-4 px-4 py-3 items-center border-b hover:bg-gray-50"
            >
              {/* Người dùng */}
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || defaultAvatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">{u.username}</span>
              </div>

              {/* Liên hệ */}
              <div className="text-sm text-gray-600">
                <div>{u.email}</div>
                <div>{u.phone}</div>
              </div>

              {/* Vai trò */}
              <div>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u._id, e.target.value, u.role)
                  }
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor:
                      u.role === "admin"
                        ? "#DBEAFE"
                        : u.role === "seller"
                        ? "#EDE9FE"
                        : "#F3F4F6",
                    color:
                      u.role === "admin"
                        ? "#1D4ED8"
                        : u.role === "seller"
                        ? "#6D28D9"
                        : "#374151",
                  }}
                >
                  {[...new Set([u.role, ...roles])].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Địa chỉ */}
              <div className="text-sm text-gray-600">
                {u.province || "Chưa cập nhật"}
              </div>

              {/* Hành động */}
              <div className="col-span-2 flex gap-4 justify-center">
                <button onClick={() => setEditingUser(u)}>
                  <Edit className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                </button>
                <button onClick={() => setDeletingUser(u)}>
                  <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">Không có người dùng</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Popups */}
      {editingUser && (
        <UpdateUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onConfirm={handleUpdateUser}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={() => handleDeleteUser(deletingUser._id)}
        />
      )}
      {addingUser && (
        <AddUserModal
          isOpen={addingUser}
          onClose={() => setAddingUser(false)}
          onConfirm={handleAddUser}
        />
      )}
    </div>
  );
}
