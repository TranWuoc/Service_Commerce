import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchUntilDate } from "../../../api/revenueApi";
import { toast } from "../../../hooks/use-toast";

// Đăng ký các thành phần cần thiết của Chart.js
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

const StatisticUntilDate: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUntilDate();
        console.log("Dữ liệu thống kê:", data);
        if (data) {
          setChartData(data);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu thống kê",
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
    const labels = chartData.map((item) => item.field_name);
    const dataValues = chartData.map((item) => item.total_bookings);
    const backgroundColors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
    ];

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số lượng đặt sân",
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("0.7", "1"),
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y", 
        responsive: true,
        plugins: {
          legend: {
            display: false, 
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.parsed.x} lượt đặt`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
            },
            ticks: {
              precision: 0,
              stepSize: 1,
            },
          },
          y: {
            title: {
              display: true,
            },
          },
        },
      },
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
    return <div className="text-center py-8">Không có dữ liệu để hiển thị</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Thống kê số lượng đặt sân</h2>
      <div className="relative h-96">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default StatisticUntilDate;
