import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../ui/select"
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditUserModal from "./EditUserModal";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        setUsers(data.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-xl shadow p-4 bg-white">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                Người dùng
              </th>
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                Liên hệ
              </th>
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                Vai trò
              </th>
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                Trạng thái
              </th>
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-2 align-middle flex items-center gap-2">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.fullname}
                    className="w-8 h-8 rounded-full"
                  />
                  {user.fullname}
                </td>
                <td className="p-2 align-middle">
                  <div>{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="p-2 align-middle">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user._id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Khách hàng</SelectItem>
                      <SelectItem value="seller">Nhân viên</SelectItem>
                      <SelectItem value="shipper">Shipper</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2 align-middle">
                  {user.isActive ? (
                    <span className="text-green-600 font-medium">Hoạt động</span>
                  ) : (
                    <span className="text-red-500 font-medium">Tạm khóa</span>
                  )}
                </td>
                <td className="p-2 align-middle text-right flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          user={selectedUser}
          onConfirm={() => {
            handleDelete(selectedUser._id);
            setShowDeleteModal(false);
          }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {showEditModal && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) =>
            setUsers((prev) =>
              prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            )
          }
        />
      )}
    </div>
  );
}
