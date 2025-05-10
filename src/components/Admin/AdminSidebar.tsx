import {
  Home,
  ManageSearch,
  CalendarMonth,
  BarChart,
  Help,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AvatarMenu } from "../Profile/Avatar";
import { useState, useEffect } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Theo dõi kích thước màn hình và ẩn sidebar nếu nhỏ hơn 50% chiều rộng
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < window.screen.width * 0.5) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    // Lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);

    // Gọi ngay khi component mount
    handleResize();

    // Cleanup khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isSidebarVisible) return null; // Ẩn sidebar nếu không hiển thị

  return (
    <div className="h-screen bg-gray-50 text-gray-700 flex flex-col p-4 fixed left-0 top-0 shadow-md gap-4 w-64 max-w-[16rem] md:w-60 lg:w-72 transition-all duration-300">
      {/* Logo */}
      <h2 className="flex justify-center items-center w-full text-amber-500 text-2xl font-bold font-['Poppins'] leading-10 tracking-wider [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] cursor-pointer">
        SupperBowls
      </h2>

      {/* Avatar */}
      <div className="flex items-center h-24">
        <AvatarMenu />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          <li
            className={`flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 ${
              location.pathname === "/admin" ? "text-orange-500" : ""
            }`}
          >
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin");
              }}
              className="flex items-center w-full"
            >
              <Home className="mr-2" /> Trang chủ
            </a>
          </li>
          <li
            className={`flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 ${
              location.pathname === "/admin/manage" ||
              location.pathname === "/admin/manage/FieldInfo" ||
              location.pathname === "/admin/manage/addField"
                ? "text-orange-500"
                : ""
            }`}
          >
            <a
              href="/admin/manage"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/manage");
              }}
              className="flex items-center w-full"
            >
              <ManageSearch className="mr-2" /> Quản lý thông tin sân
            </a>
          </li>
          
          <li
            className={`flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500 ${
              location.pathname === "/admin/statistic" ? "text-orange-500" : ""
            }`}
            onClick={() => navigate("/admin/statistic")}
          >
            <BarChart className="mr-2" /> Thống kê
          </li>
          <li
            className="flex items-center py-3 px-2 cursor-pointer hover:text-orange-500 active:text-orange-500"
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