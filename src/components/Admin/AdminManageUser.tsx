import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import { fetchUser } from "../../api/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import { ConfirmModal } from "../Shared_components/ConfirmModal";

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const AdminManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = React.useState("bottom");
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    user: User | null;
  }>({ visible: false, user: null });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUser();
        if (usersData) {
          setUsers(usersData);
        }
      } catch (err) {
        setError("Failed to load users");
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `http://localhost:8000/api/user/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Cập nhật danh sách người dùng sau khi xoá thành công
      setUsers(users.filter((user) => user.id !== userId));
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const toggleUserSelection = (userId: string) => {
    // Thay đổi tham số từ number sang string
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const SearchIcon = () => (
    <svg
      className="w-4 h-4 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
  );

  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  const handleStatusChange = (value: string, user: User) => {
    if (value === "inactive") {
      setConfirmModal({ visible: true, user });
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmModal.user) {
      await deleteUser(confirmModal.user.id);
      toast({
        title: "Success",
        description: `User ${confirmModal.user.name} has been deleted.`,
        variant: "success2",
      });
    }
    setConfirmModal({ visible: false, user: null });
  };

  const handleCancelDelete = () => {
    setConfirmModal({ visible: false, user: null });
  };

  const UserRow = ({ user, isSelected, onSelect }: UserRowProps) => {
    const defaultAvatar = "/userdefault.png";
    const avatarUrl =
      user?.avatar &&
      typeof user.avatar === "string" &&
      user.avatar.includes("googleusercontent")
        ? user.avatar
        : user?.avatar
          ? `http://localhost:8000/${user?.avatar}`
          : defaultAvatar;

    const status = user.status === "1" ? "online" : "offline";

    const position = user.is_admin === 1 ? "Admin" : "User";

    return (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <th
          scope="row"
          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
        >
          <img
            className="w-10 h-10 rounded-full"
            src={avatarUrl}
            alt={`${user.name} avatar`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultAvatar;
            }}
          />
          <div className="ps-3">
            <div className="text-base font-semibold">{user.name}</div>
            <div className="font-normal text-gray-500">{user.email}</div>
          </div>
        </th>
        <td className="px-11 py-4 text-green-400 font-bold">{position}</td>

        <td className="py-4 text-base font-semibold pb-4 text-orange-500">
          {user.phone_number}
        </td>

        <td className="px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Thao tác</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Chọn trạng thái tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(value) => handleStatusChange(value, user)}
              >
                <DropdownMenuRadioItem value="online">
                  Hoạt động
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inactive">
                  Ngưng hoạt động
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
  };

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg mt-8 mr-8">
      {/* Table Actions */}
      <div className="flex items-center justify-end flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 pt-4 pr-4">
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ConfirmModal
        visible={confirmModal.visible}
        title="Xác nhận xóa người dùng"
        message={
          confirmModal.user
            ? `Bạn có chắc chắn muốn xóa user ${confirmModal.user.name}?`
            : ""
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Users Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="pl-20 py-3">
              Tên người dùng
            </th>
            <th scope="col" className="px-6 py-3">
              Quyền hạn
            </th>
            <th scope="col" className="px-9 py-3">
              SĐT
            </th>
            <th scope="col" className="px-6 py-3">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={toggleUserSelection}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageUser;
