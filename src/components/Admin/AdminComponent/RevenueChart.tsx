import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchRevenueByField } from '../../../api/revenueApi';
import { format, eachMonthOfInterval } from 'date-fns';

interface ChartData {
  month: string;
  [fieldName: string]: number | string;
}

const RevenueLineChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // 1. Gọi API 1 lần lấy dữ liệu cả năm
        const start_date = `${selectedYear}-01-01`;
        const end_date = `${selectedYear}-12-31`;
        const rawData = await fetchRevenueByField({ start_date, end_date }) || [];

        // 2. Tạo danh sách 12 tháng trong năm
        const months = eachMonthOfInterval({
          start: new Date(selectedYear, 0, 1),
          end: new Date(selectedYear, 11, 31),
        });

        // 3. Khởi tạo object map: { "yyyy-MM": { fieldName: totalRevenue, ... }, ... }
        const monthlyMap: Record<string, Record<string, number>> = {};

        rawData.forEach((item: any) => {
          const fieldName = item.field.name;
          // Lấy tháng theo created_at hoặc giả sử doanh thu thuộc tháng nào đó — nếu backend không có trường tháng riêng thì cần có trường ngày
          const date = item.created_at ? new Date(item.created_at) : new Date(); // hoặc xử lý khác tùy backend trả
          const monthKey = format(date, 'yyyy-MM');

          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = {};
          }
          monthlyMap[monthKey][fieldName] = (monthlyMap[monthKey][fieldName] || 0) + item.total_revenue;
        });

        // 4. Lấy danh sách tất cả fieldName
        const allFieldNames = new Set<string>();
        rawData.forEach((item: any) => allFieldNames.add(item.field.name));

        // 5. Tạo dữ liệu chart: cho đủ 12 tháng và tất cả các sân, gán 0 nếu không có doanh thu
        const finalData = months.map(monthDate => {
          const monthKey = format(monthDate, 'yyyy-MM');
          const monthData: ChartData = { month: monthKey };

          allFieldNames.forEach(fieldName => {
            monthData[fieldName] = monthlyMap[monthKey]?.[fieldName] || 0;
          });

          return monthData;
        });

        setChartData(finalData);
        setFieldNames(Array.from(allFieldNames));
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Biểu đồ doanh thu theo tháng ({selectedYear})</h2>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-md px-3 py-2"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>Năm {year}</option>
          ))}
        </select>
      </div>

      {chartData.length > 0 && fieldNames.length > 0 ? (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tickFormatter={(month) => `T${month.split('-')[1]}`}
                tickCount={12}
                interval={0}
                tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                height={60}
              />
              <YAxis
                tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                domain={[0, 'auto']}
                tick={{ fontSize: 12 }}
                width={80}
                label={{
                  value: 'Doanh thu (VND)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 14 }
                }}
              />
              <Tooltip
                formatter={(value) => [
                  new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(Number(value)),
                  'Doanh thu'
                ]}
              />
              <Legend />
              {fieldNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu doanh thu
        </div>
      )}
    </div>
  );
};

export default RevenueLineChart;
