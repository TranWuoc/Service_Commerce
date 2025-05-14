import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFields } from "../../api/fieldApi"; // Giữ nguyên hàm fetchFields ban đầu
import Button from "../../components/Shared_components/Button";
import { Field } from "../../types/Field";
interface FieldStatus {
  total: number;
  active: number;
  maintenance: number;
  deactivated: number;
  suspended: number;
}


const AdminDashboard: React.FC = () => {
  const [status, setStatus] = useState<FieldStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fields = await fetchFields();
        
        // Tính toán thống kê từ dữ liệu fields
        const status = {
          total: fields.length,
          active: fields.filter(f => f.state.name === "Active").length,
          maintenance: fields.filter(f => f.state.name === "Maintenance").length,
          deactivated: fields.filter(f => f.state.name === "Deactivated").length,
          suspended: fields.filter(f => f.state.name === "Suspended").length
        };
        
        setStatus(status);
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }




  return (
    <div className="flex flex-col bg-gray-100 p-6 gap-5">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Thẻ tổng số sân */}
        <div 
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/manage")}
        >
          <div className="w-24 h-24 bg-blue-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/football-field-stadium-svgrepo-com copy.svg"
              alt="Football Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Tổng số sân</h1>
          <p className="text-2xl font-bold">{status?.total || 0}</p>
          <p className="text-sm text-zinc-500 leading-6">
            Tất cả sân trong hệ thống
          </p>
        </div>

        {/* Thẻ sân Active */}
        <div 
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/manage?status=Active")}
        >
          <div className="w-24 h-24 bg-green-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/football-field-stadium-svgrepo-com copy.svg"
              alt="Active Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Sân hoạt động</h1>
          <p className="text-2xl font-bold text-green-600">{status?.active || 0}</p>
          <p className="text-sm text-zinc-500 leading-6">
            Sân đang hoạt động bình thường
          </p>
        </div>

        {/* Thẻ sân Maintenance */}
        <div 
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/manage?status=Maintenance")}
        >
          <div className="w-24 h-24 bg-yellow-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/football-field-stadium-svgrepo-com copy.svg"
              alt="Maintenance Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Sân bảo trì</h1>
          <p className="text-2xl font-bold text-yellow-600">{status?.maintenance || 0}</p>
          <p className="text-sm text-zinc-500 leading-6">
            Sân đang trong quá trình bảo trì
          </p>
        </div>

        {/* Thẻ sân không hoạt động */}
        <div 
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/manage?status=Inactive")}
        >
          <div className="w-24 h-24 bg-red-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/football-field-stadium-svgrepo-com copy.svg"
              alt="Inactive Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Sân ngừng hoạt động</h1>
          <p className="text-2xl font-bold text-red-600">
            {(status?.deactivated || 0) + (status?.suspended || 0)}
          </p>
          <p className="text-sm text-zinc-500 leading-6">
            Bao gồm sân bị vô hiệu hóa và tạm ngừng
          </p>
        </div>
      
        <div className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded">
          <div className="w-24 h-24 bg-amber-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/user-001.svg" // Đường dẫn trực tiếp
              alt="Football Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }} // Đổi màu icon sang trắng
            />
          </div>
          <h1 className="font-bold text-xl">Tổng số người dùng </h1>
          <p className="text-sm text-zinc-500 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fuga
            adipisicing elit
          </p>
        </div>
        <div className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded">
          <div className="w-24 h-24 bg-amber-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/statistic-001.svg" // Đường dẫn trực tiếp
              alt="Football Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }} // Đổi màu icon sang trắng
            />
          </div>
          <h1 className="font-bold text-xl">Tổng doanh thu </h1>
          <p className="text-sm text-zinc-500 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fuga
            adipisicing elit
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
