import { Home, CalendarMonth, SportsSoccer,Stadium   } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng useLocation để lấy đường dẫn hiện tại

  // Hàm kiểm tra xem đường dẫn hiện tại có trùng với đường dẫn của item hay không
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gray-50 text-gray-600 flex flex-col p-4">
      <nav className="mt-6">
        <ul>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/")}
          >
            <Home className="mr-2" /> Trang chủ
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/booked-fields") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/booked-fields")}
          >
            <CalendarMonth className="mr-2" /> Sân bóng đã đặt
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/dashboard/booking") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
            onClick={() => navigate("/dashboard/booking")}
          >
            <SportsSoccer className="mr-2" /> Đặt sân
          </li>
          <li 
            className={`flex items-center py-3 cursor-pointer ${isActive("/dashboard") ? "text-orange-500" : "hover:text-orange-500 active:text-orange-500"} mb-4`}
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
