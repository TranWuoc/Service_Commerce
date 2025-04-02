import { Home, ManageSearch, CalendarMonth, BarChart, Help, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-50 text-gray-700 flex flex-col p-4 fixed left-0 top-0 shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
      <nav>
        <ul>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/admin")}
          >
            <Home className="mr-2" /> Trang chủ
          </li>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/admin/manage-fields")}
          >
            <ManageSearch className="mr-2" /> Quản lý thông tin sân
          </li>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/admin/booked-fields")}
          >
            <CalendarMonth className="mr-2" /> Danh sách sân đã đặt
          </li>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/admin/statistics")}
          >
            <BarChart className="mr-2" /> Thống kê
          </li>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/admin/help")}
          >
            <Help className="mr-2" /> Trợ giúp
          </li>
          <li 
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500"
            onClick={() => navigate("/admin/settings")}
          >
            <Settings className="mr-2" /> Cài đặt
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
