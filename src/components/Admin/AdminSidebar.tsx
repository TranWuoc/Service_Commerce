import {
  Home,
  ManageSearch,
  CalendarMonth,
  BarChart,
  Help,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AvatarMenu } from "../Profile/Avatar";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-50 text-gray-700 flex flex-col p-4 fixed left-0 top-0 shadow-md gap-4">
      <h2 className="flex justify-center items-center w-full  text-amber-500 text-2xl font-bold font-['Poppins'] leading-10 tracking-wider [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] cursor-pointer">
        SupperBowls
      </h2>
      <div className="flex items-center h-24">
        <AvatarMenu />
      </div>
      <nav>
        <ul>
          <li
            className={`flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4 ${
              location.pathname === "/admin" ? "text-orange-500" : ""
            }`}
          >
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault(); // Ngăn trình duyệt tải lại trang
                navigate("/admin"); // Điều hướng bằng React Router
              }}
              className="flex items-center w-full"
            >
              <Home className="mr-2" /> Trang chủ
            </a>
          </li>
          <li
            className={`flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4 ${
              location.pathname === "/admin/manager" ? "text-orange-500" : ""
            }`}
          >
            <a
              href="/admin/manager"
              onClick={(e) => {
                e.preventDefault(); 
                navigate("/admin/manager"); 
              }}
              className="flex items-center w-full"
            >
            <ManageSearch className="mr-2" /> Quản lý thông tin sân

            </a>
          </li>
          <li
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("")}
          >
            <CalendarMonth className="mr-2" /> Danh sách sân
          </li>
          <li
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("")}
          >
            <BarChart className="mr-2" /> Thống kê
          </li>
          <li
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 mb-4"
            onClick={() => navigate("")}
          >
            <Help className="mr-2" /> Trợ giúp
          </li>
          <li
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500"
            onClick={() => navigate("")}
          >
            <Settings className="mr-2" /> Cài đặt
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
