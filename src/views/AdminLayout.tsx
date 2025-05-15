import React from "react";
import AdminSidebar from "../components/Admin/AdminSidebar"; // Sidebar của admin
import { AvatarMenu } from "../components/Profile/Avatar"; // Avatar của admin
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Theo dõi kích thước màn hình và ẩn sidebar khi nhỏ hơn 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/manage":
        return "Quản lý thông tin sân";
      case "/admin/manageUser":
        return "Quản lý người dùng";
      case "/admin/Profile":
        return "Hồ sơ Admin";
      case "/admin/statistic":
        return "Thống kê ";
      // default:
      //   return "Trang quản lý Admin";
    }
  };
  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      {isSidebarVisible && (
        <aside className="w-64 md:w-60 lg:w-72  flex-shrink-0">
          <AdminSidebar />
        </aside>
      )}

      {/* Nút toggle sidebar */}
      {!isSidebarVisible && (
        <button
          onClick={() => setIsSidebarVisible(true)}
          className="absolute top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          ☰
        </button>
      )}

      {/* Main content */}
      <main className="flex-1 ml-1  overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-neutral-100 shadow-sm">
          <div className="flex items-end justify-end py-4 px-6">
            <AvatarMenu />
          </div>
        <div className="mt-6 ">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{getPageTitle()}</h1>
          {children}
        </div>
        </div>

        {/* Main content */}
      </main>
    </div>
  );
};

export default AdminLayout;
