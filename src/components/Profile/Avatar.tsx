import { useState, useEffect } from "react";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import axiosInstance from "../../api/axiosInstance"; // Import axiosInstance

export const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, setUser } = useUser(); // Get user from context
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      if (!token) {
        console.warn("No auth token found. Redirecting to login...");
        navigate("/login");
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
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleViewProfile = () => {
    navigate("/dashboard/Profile", { state: user }); // Navigate to user profile page
    handleClose();
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

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

      // After successful logout, remove tokens and user data from localStorage and context
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user"); // Remove user data from localStorage
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
