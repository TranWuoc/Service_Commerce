import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFields } from "../../api/fieldApi";
import { fetchUser } from "../../api/userApi";
import { fetchRevenueByField } from "../../api/revenueApi";
import { RevenueByFieldItem } from "../../types/Field";
import { format } from "date-fns";

interface FieldStatus {
  total: number;
  active: number;
  maintenance: number;
  deactivated: number;
  suspended: number;
}

interface UserStats {
  totalUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [status, setStatus] = useState<FieldStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenueLoading, setRevenueLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fields, users] = await Promise.all([
          fetchFields(),
          fetchUser()
        ]);

        // Tính toán thống kê từ dữ liệu fields
        const status = {
          total: fields.length,
          active: fields.filter((f) => f.state.name === "Active").length,
          maintenance: fields.filter((f) => f.state.name === "Maintenance").length,
          deactivated: fields.filter((f) => f.state.name === "Deactivated").length,
          suspended: fields.filter((f) => f.state.name === "Suspended").length,
        };

        setStatus(status);
        setUserStats({
          totalUsers: users?.length || 0,
        });
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        setRevenueLoading(true);
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Đặt thời gian từ 00:00:00 đến 23:59:59
        const startDateTime = new Date(firstDayOfMonth);
        startDateTime.setHours(0, 0, 0, 0);
        
        const endDateTime = new Date(today);
        endDateTime.setHours(23, 59, 59, 999);

        const params = {
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
        };

        const data = await fetchRevenueByField(params);
        if (data) {
          const total = data.reduce((sum, item) => sum + item.total_revenue, 0);
          setTotalRevenue(total);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu doanh thu:", err);
      } finally {
        setRevenueLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
          <p className="text-2xl font-bold text-green-600">
            {status?.active || 0}
          </p>
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
          <p className="text-2xl font-bold text-yellow-600">
            {status?.maintenance || 0}
          </p>
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

        {/* Thẻ tổng số người dùng */}
        <div
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/manageUser")}
        >
          <div className="w-24 h-24 bg-purple-500 rounded-full absolute -right-4 -top-10">
            <img
              src="/user-001.svg"
              alt="User Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Tổng số người dùng</h1>
          <p className="text-2xl font-bold text-purple-600">
            {userStats?.totalUsers || 0}
          </p>
          <p className="text-sm text-zinc-500 leading-6">
            Tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Thẻ tổng doanh thu */}
        <div 
          className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/admin/statistic/revenue")}
        >
          <div className="w-24 h-24 bg-amber-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/statistic-001.svg"
              alt="Revenue Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Tổng doanh thu</h1>
          {revenueLoading ? (
            <p className="text-sm text-zinc-500">Đang tải dữ liệu...</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-zinc-500 leading-6">
                Doanh thu từ {format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "dd/MM/yyyy")} đến nay
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;