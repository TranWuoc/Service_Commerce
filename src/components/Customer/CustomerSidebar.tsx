import { Home, CalendarMonth, SportsSoccer,Stadium   } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng useLocation để lấy đường dẫn hiện tại

 
const isActive = (path1, path2) => {
  const currentPath = window.location.pathname;
  return currentPath === path1 || currentPath === path2;
};

  return (
    <div className=" flex w-64 h-screen bg-gray-50 text-gray-600 flex flex-col p-4">
      <nav className="mt-6">
        <ul>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/")}
          >
            <Home className="mr-2" /> Trang chủ
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/dashboard/history") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/dashboard/history")}
          >
            <CalendarMonth className="mr-2" /> Lịch sử đặt sân
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/dashboard/booking") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/dashboard/booking")}
          >
            <SportsSoccer className="mr-2" /> Đặt sân
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/dashboard","/dashboard/FieldInfo") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/dashboard")}
          >
            <Stadium className="mr-2" /> Sân bóng
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SidebarCustomer;
