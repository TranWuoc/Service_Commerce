import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
  // Dữ liệu tĩnh cho biểu đồ
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: [50, 70, 40, 90, 100, 80, 60, 110, 120, 130, 140, 150], // Doanh thu theo tháng
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Màu cột
        borderColor: "rgba(54, 162, 235, 1)", // Màu viền
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Vị trí của chú thích
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu theo tháng", // Tiêu đề biểu đồ
      },
    },
  };

  return (
    <div className="flex flex-col bg-gray-100 p-6 gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quản lý thông tin sân</h2>
          <p className="text-gray-600 mb-4">Thêm, sửa, xóa thông tin sân bóng.</p>
          <button className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Xem chi tiết
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Danh sách sân</h2>
          <p className="text-gray-600 mb-4">Xem trạng thái và thông tin chi tiết của các sân bóng.</p>
          <button className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Xem chi tiết
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thống kê</h2>
          <p className="text-gray-600 mb-4">Xem báo cáo và thống kê chi tiết.</p>
          <button className="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Biểu đồ thống kê */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Biểu đồ thống kê</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboard;