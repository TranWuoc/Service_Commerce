import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchRevenueByField } from '../../../api/revenueApi';
import { format, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';

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
      try {
        setLoading(true);
        
        // 1. Tạo danh sách 12 tháng trong năm
        const months = eachMonthOfInterval({
          start: new Date(selectedYear, 0, 1),
          end: new Date(selectedYear, 11, 31)
        });

        // 2. Lấy dữ liệu cho từng tháng
        const allData = await Promise.all(
          months.map(async (month) => {
            const start = format(startOfMonth(month), 'yyyy-MM-dd');
            const end = format(endOfMonth(month), 'yyyy-MM-dd');
            
            try {
              const response = await fetchRevenueByField({ start_date: start, end_date: end });
              return {
                month: format(month, 'yyyy-MM'),
                data: response || []
              };
            } catch (error) {
              console.error(`Error fetching data for ${format(month, 'yyyy-MM')}:`, error);
              return {
                month: format(month, 'yyyy-MM'),
                data: []
              };
            }
          })
        );

        // 3. Chuẩn bị dữ liệu cho biểu đồ
        const uniqueFieldNames = new Set<string>();
        const processedData = allData.map(({ month, data }) => {
          const monthData: ChartData = { month };
          
          data.forEach((item: any) => {
            const fieldName = item.field.name;
            uniqueFieldNames.add(fieldName);
            monthData[fieldName] = item.total_revenue;
          });
          
          return monthData;
        });

        // 4. Đảm bảo tất cả các tháng có cùng cấu trúc dữ liệu
        const completeData = processedData.map(item => {
          Array.from(uniqueFieldNames).forEach(name => {
            if (item[name] === undefined) {
              item[name] = 0;
            }
          });
          return item;
        });

        setChartData(completeData);
        setFieldNames(Array.from(uniqueFieldNames));
        
      } catch (error) {
        console.error('Error loading data:', error);
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
    margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // Tăng margin bottom để hiển thị nhãn trục X
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
      tickCount={6}
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
          {chartData.length === 0 ? 'Đang xử lý dữ liệu...' : 'Không có dữ liệu doanh thu'}
        </div>
      )}
    </div>
  );
};

export default RevenueLineChart;