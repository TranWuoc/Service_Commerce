import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import axiosInstance from "../../api/axiosInstance"; // Import useUser từ UserContext
import { toast, useToast } from "../../hooks/use-toast";

export const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, setUser } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ API hoặc localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/profile");
        setUser(response.data); // Cập nhật thông tin người dùng trong context
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false); // Dữ liệu đã tải xong
      }
    };

    if (!user) { // Kiểm tra xem có thông tin người dùng chưa
      fetchUserData();
    } else {
      setLoading(false); // Nếu đã có thông tin người dùng trong context, không cần phải gọi lại API
    }
  }, [navigate, user, setUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    navigate("/dashboard/Profile", { state: user });
    handleClose();
  };

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null); // Đặt lại thông tin người dùng trong context
    navigate("/login");
    handleClose();
    toast({
      variant: "destructive",
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản của mình.",
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar alt={user?.name || "User"} src="profile-image.jpg" sx={{ width: 40, height: 40 }} />
      <span className="font-medium text-gray-800">
        {loading ? "Loading..." : user?.name || "No Name"}
      </span>
      <IconButton onClick={handleClick}>
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {/* Hiển thị menu dựa trên vai trò */}
        {user?.is_admin ? (
          <>
            <MenuItem onClick={() => navigate("/admin")}>Quản lý hệ thống</MenuItem>
            <MenuItem onClick={() => navigate("/admin/users")}>Quản lý người dùng</MenuItem>
            <MenuItem onClick={() => navigate("/admin/settings")}>Cài đặt</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleViewProfile}>Xem thông tin tài khoản</MenuItem>
            <MenuItem onClick={() => navigate("/dashboard/bookings")}>Lịch sử đặt sân</MenuItem>
          </>
        )}
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};
