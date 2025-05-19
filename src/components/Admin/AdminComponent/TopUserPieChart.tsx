import React, { useEffect, useRef, useState } from "react";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import { fetchStatisticsActiveUsers } from "../../../api/revenueApi";
import { toast } from "../../../hooks/use-toast";
import Button from "../../Shared_components/Button";
import { useNavigate } from "react-router-dom";

// Đăng ký các thành phần cần thiết của Chart.js
Chart.register(ArcElement, Tooltip, Legend, PieController);

const TopUsersPieChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const chartInstance = useRef<Chart | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStatisticsActiveUsers();
        if (data) {
          setChartData(data);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu người dùng",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    // Hủy biểu đồ cũ nếu tồn tại
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Chuẩn bị dữ liệu cho biểu đồ
    const labels = chartData.map(item => item.name);
    const dataValues = chartData.map(item => item.total_bookings);
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Số lượng đặt sân',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} lượt đặt (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Cleanup khi component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  if (chartData.length === 0) {
    return <div className="text-center py-8">Không có dữ liệu người dùng</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Top người dùng đặt sân nhiều nhất</h2>
      <div className="relative h-96">
        <canvas ref={chartRef} />
      </div>
      <Button
              text="Xem chi tiết"
              type="primary"
              onClick={() => navigate("/admin/statistic/top-user")}
              customStyle={{ marginTop: "10px" }}
            />
    </div>
  );
};

export default TopUsersPieChart;