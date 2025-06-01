import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { fetchRevenueByField } from '../../../api/revenueApi';
import { format, parseISO, eachMonthOfInterval } from 'date-fns';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57', '#d88884'];

const RevenueLineChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const start_date = `${selectedYear}-01-01`;
        const end_date = `${selectedYear}-12-31`;
        const rawData = await fetchRevenueByField({ start_date, end_date }) || [];

        const revenueMap: Record<string, Record<string, number>> = {};
        const allFieldNames: Set<string> = new Set();

        rawData.forEach((item: any) => {
          const fieldName = item.field?.name || 'Không tên';
          const receipts = item.receipts || [];
          const totalRevenue = item.total_revenue || 0;

          allFieldNames.add(fieldName);

          if (receipts.length === 0) return;

          // Phân phối doanh thu đều cho mỗi receipt (mỗi tháng)
          const revenuePerReceipt = totalRevenue / receipts.length;

          receipts.forEach((receipt: any) => {
            const date = parseISO(receipt.created_at);
            const monthKey = format(date, 'yyyy-MM');

            if (!revenueMap[monthKey]) revenueMap[monthKey] = {};
            if (!revenueMap[monthKey][fieldName]) revenueMap[monthKey][fieldName] = 0;

            revenueMap[monthKey][fieldName] += revenuePerReceipt;
          });
        });

        const months = eachMonthOfInterval({
          start: new Date(selectedYear, 0, 1),
          end: new Date(selectedYear, 11, 31),
        });

        const finalData = months.map(monthDate => {
          const monthKey = format(monthDate, 'yyyy-MM');
          const monthData: any = { month: monthKey };

          allFieldNames.forEach(field => {
            monthData[field] = revenueMap[monthKey]?.[field] || 0;
          });

          return monthData;
        });

        setFieldNames(Array.from(allFieldNames));
        setChartData(finalData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

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

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) => {
                if (typeof month === 'string' && month.includes('-')) {
                  return `T${month.split('-')[1]}`;
                }
                return month;
              }}
              interval={0}
              tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
              height={60}
            />
            <YAxis
              tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
              label={{
                value: 'Doanh thu (VND)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 14 }
              }}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(Number(value)),
                'Doanh thu'
              ]}
            />
            <Legend />
            {fieldNames.map((field, index) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu doanh thu
        </div>
      )}
    </div>
  );
};

export default RevenueLineChart;
