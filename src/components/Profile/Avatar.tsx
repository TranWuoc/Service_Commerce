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

  // Fetch user data when component mounts or token changes
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Set user data in context
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched or an error occurs
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  // Handle menu click
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  // View profile based on user role
  const handleViewProfile = () => {
    if (user?.is_admin) {
      navigate("/admin/Profile", { state: user }); // Navigate to admin profile page
    } else {
      navigate("/dashboard/Profile", { state: user }); // Navigate to user profile page
    }
    handleClose(); // Close menu after navigation
  };

  // Handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No auth token found. Cannot logout.");
      return;
    }

    try {
      await axiosInstance.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token to logout endpoint
        },
      });

      // After successful logout, clear the localStorage and reset the user context
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null); // Reset user context
      navigate("/login"); // Navigate to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message || error.message);
    } finally {
      handleClose(); // Close menu after logout
    }
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
        <MenuItem onClick={handleViewProfile}>Xem thông tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};
