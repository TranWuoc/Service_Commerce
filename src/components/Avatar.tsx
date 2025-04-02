import React, { useState } from 'react';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

const AvatarMenu = ({ avatarUrl, userName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    navigate("/profile"); // Điều hướng đến trang thông tin tài khoản
    handleClose();
  };

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    alert("Đã đăng xuất!");
    handleClose();
  };

  return (
    <div className="flex items-center space-x-2">
  
      <Avatar alt={userName} src={avatarUrl} sx={{ width: 40, height: 40 }} />
      <span className="font-medium text-gray-800">{userName}</span> {/* Hiển thị tên người dùng */}


      <IconButton onClick={handleClick}>
        <ArrowDropDownIcon />
      </IconButton>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleViewProfile}>Xem thông tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};

export default AvatarMenu;
