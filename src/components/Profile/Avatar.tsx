import { useState, useEffect } from "react";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import axiosInstance from "../../api/axiosInstance"; // Import axiosInstance

export const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, setUser } = useUser(); // Get user from context
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "null");
        if (userData) {
          setUser(userData); // Set user data from localStorage
        }
      } catch (error) {
        console.error("Failed to fetch user data from localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleViewProfile = async () => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) {
      console.warn("No auth token found. Redirecting to login...");
      navigate("/login"); // Redirect to login if no token
      return;
    }

    try {
      const response = await axiosInstance.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Use token to fetch user data
        },
      });

      const userData = response.data;
      setUser(userData); // Set user data in context

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage

      console.log("userData:", userData);
      if (userData.id === 'admin_000') {
      
        navigate("/admin/Profile", { state: userData }); // Điều hướng đến trang admin
      } else {
        console.log("Navigating to /dashboard/Profile");
        navigate("/dashboard/Profile", { state: userData }); // Điều hướng đến trang người dùng
      }
      handleClose();
      handleClose(); // Close the menu
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        // Optionally, redirect to login page if token is invalid
        navigate("/login");
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user"); 
      localStorage.removeItem("isAdmin"); // Remove isAdmin from localStorage
      localStorage.removeItem("user_id"); // Remove isLoggedIn from localStorage
      // Remove user data from localStorage
      setUser(null); // Reset user data in context
      navigate("/login"); // Navigate to login page
    }

    try {
      await axiosInstance.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token to logout endpoint
        },
      });

      // After successful logout, remove tokens and user data from localStorage and context
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user"); 
      localStorage.removeItem("isAdmin"); // Remove isAdmin from localStorage
      localStorage.removeItem("user_id"); // Remove isLoggedIn from localStorage
      // Remove user data from localStorage
      setUser(null); // Reset user data in context
      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message || error.message);
    } finally {
      handleClose(); // Close menu after logout
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar alt={user?.name || "User"}  src={ user?.avatar.includes("googleusercontent")? user?.avatar :"http://localhost:8000/" + user?.avatar} sx={{ width: 40, height: 40 }} />
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
        <MenuItem onClick={handleViewProfile}>Xem thông tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};
