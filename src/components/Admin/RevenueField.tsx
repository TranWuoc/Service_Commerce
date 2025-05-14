import React, { useEffect, useState } from "react";
import { fetchRevenueByField } from "../../api/revenueApi";
import { RevenueByFieldItem } from "../../types/Field";

const RevenueField: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueByFieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRevenueByField();
        if (data) {
          setRevenueData(data);
        } else {
          setError("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu");
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Hàm rút gọn địa chỉ
  const shortenAddress = (address: string): string => {
    const parts = address.split(",");
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}`;
    }
    return address;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Thống kê doanh thu sân bóng</h2>
        <p className="text-gray-600">
          Doanh thu từ ngày 01/01/2025 đến 30/05/2025
        </p>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá thuê (VND/giờ)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {revenueData.length > 0 ? (
              revenueData.map((item, index) => (
                <tr key={item.field_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.field.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {shortenAddress(item.field.address)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.field.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(item.total_revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu doanh thu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {revenueData.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-blue-50 px-4 py-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Tổng cộng:</span>{" "}
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.total_revenue, 0),
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueField;
