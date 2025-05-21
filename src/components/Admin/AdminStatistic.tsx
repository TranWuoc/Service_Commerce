import React, { useEffect, useState } from "react";
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
import Button from "../../components/Shared_components/Button";
import { fetchRevenueByField } from "../../api/revenueApi";
import StatisticUntilDate from "./AdminComponent/ChartField";
import TopUsersPieChart from "./AdminComponent/TopUserPieChart";
import RevenueCard from "./AdminComponent/RevenueCard";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
import RevenueLineChart from "./AdminComponent/RevenueChart";

const AdminStatistics: React.FC = () => {
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

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex flex-col bg-gray-100 p-6 gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <TopUsersPieChart />
        <StatisticUntilDate />
        </div>
          <RevenueCard />
           <RevenueLineChart />
      </div>
    </div>
  );
};

export default AdminStatistics;
