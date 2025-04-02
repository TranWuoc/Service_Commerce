import { Home, CalendarMonth, SportsSoccer, Help, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SidebarCustomer = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-50 text-gray-600 flex flex-col p-4 fixed left-0 top-0">
      <nav className="mt-6">
        <ul>
          <li 
            className="flex items-center py-3 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2" /> Trang chủ
          </li>
          <li 
            className="flex items-center py-3 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/booked-fields")}
          >
            <CalendarMonth className="mr-2" /> Sân bóng đã đặt
          </li>
          <li 
            className="flex items-center py-3 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/book-field")}
          >
            <SportsSoccer className="mr-2" /> Đặt sân
          </li>

          <li 
            className="flex items-center py-3 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("/help")}
          >
            <Help className="mr-2" /> Trợ giúp
          </li>
          <li 
            className="flex items-center py-3 cursor-pointer hover:text-orange-500 active:text-orange-500"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2" /> Cài đặt
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarCustomer;
