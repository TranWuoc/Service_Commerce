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
import { VictoryLine } from "victory";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboard: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [doughnutOptions, setDoughnutOptions] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null); // State lưu tổng doanh thu
  const navigate = useNavigate();

  useEffect(() => {
    const loadFields = async () => {
      try {
        const fieldList = await fetchFields();
        setFields(fieldList);

        // Tạo dữ liệu cho biểu đồ Donut
        const { doughnutData, doughnutOptions } =
        generateDoughnutData(fieldList);
        setDoughnutData(doughnutData);
        setDoughnutOptions(doughnutOptions);
      } catch (error) {
        console.error("Error loading fields:", error);
      }
    };

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

    loadFields();
    loadRevenue();
  }, []);

  const generateRandomPoints = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: i * 30 + 10,
      y: Math.floor(Math.random() * 70) + 10,
    }));
  };

  const points = generateRandomPoints();

  // Tạo path dạng "Smooth Curve" dùng Quadratic Bézier
  const generateSmoothPath = () => {
    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const controlX = (prev.x + curr.x) / 2;
      path += ` Q ${controlX},${prev.y} ${curr.x},${curr.y}`;
    }

    return path;
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
    <div className="flex flex-col bg-gray-100 p-6 gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-6 gap-3">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Trạng thái sân
          </h2>
          {doughnutData ? (
            <DoughnutChart data={doughnutData} options={doughnutOptions} />
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}
          <Button
            text="Xem chi tiết"
            type="primary"
            onClick={() => navigate("/admin/manage")}
          />
        </div>

        <div className="flex flex-col justify-between items-center bg-white h-1/2 rounded-lg shadow-md p-6">
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
            onClick={() => navigate("/admin/manage")}
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
          {/* <VictoryLine data={randomData} /> */}

          <svg width="160" height="80" viewBox="0 0 160 80" className="rounded">
            {/* Đường cong mượt */}
            <path
              d={generateSmoothPath()}
              fill="none"
              stroke="#3B82F6" // Màu Tailwind blue-500
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="w-auto bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden rounded">
          <div className="w-24 h-24 bg-amber-500 rounded-full absolute -right-5 -top-7">
            <img
              src="/football-field-stadium-svgrepo-com copy.svg" // Đường dẫn trực tiếp
              alt="Football Field Icon"
              className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 mt-2"
              style={{ filter: "brightness(0) invert(1)" }} // Đổi màu icon sang trắng
            />
          </div>
          <h1 className="font-bold text-xl">Tổng số sân hiện có </h1>
          <p className="text-sm text-zinc-500 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fuga
            adipisicing elit
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
