import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { fetchFields } from "../../api/fieldApi";
import { generateDoughnutData } from "../../utils/chartDoughnutStatus";
import DoughnutChart from "../../components/Shared_components/DoughnutChart";
import Button from "../../components/Shared_components/Button";
import { Field } from "../../types/Field";
import { fetchRevenueByField } from "../../api/revenueApi";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminStatistics: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [doughnutOptions, setDoughnutOptions] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null); // State lưu tổng doanh thu
  const navigate = useNavigate();

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const revenueData = await fetchRevenueByField();
        const total = revenueData.reduce(
          (sum: number, item: any) => sum + item.total_revenue,
          0,
        ); // Tính tổng doanh thu
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error loading revenue:", error);
      }
    };

    loadRevenue();
  }, []);

  const barData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: [50, 70, 40, 90, 100, 80, 60, 110, 120, 130, 140, 150],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu theo tháng",
      },
    },
  };
  return (
    <div className="p-6 bg-gray-100">
      <div className="flex flex-col bg-gray-100 p-6 gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
          <div className="flex flex-col justify-between items-center bg-white h-auto rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Doanh thu</h2>
            {totalRevenue !== null ? (
              <p className="text-gray-800 font-bold">
                Tổng doanh thu: {totalRevenue.toLocaleString()} VND
              </p>
            ) : (
              <p>Đang tải doanh thu...</p>
            )}
            <Button
              text="Xem chi tiết"
              type="primary"
              onClick={() => navigate("/admin/statistic/revenue")}
              customStyle={{ marginTop: "10px" }}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Thống kê</h2>
            <p className="text-gray-600 mb-4">
              Xem báo cáo và thống kê chi tiết.
            </p>
            <button
              className="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              onClick={() => navigate("/admin/manage")}
            >
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Biểu đồ thống kê
          </h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
