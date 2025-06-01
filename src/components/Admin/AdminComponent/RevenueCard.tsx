import React, { useState, useEffect } from "react";
import { fetchRevenueByField } from "../../../api/revenueApi";
import Button from "../../Shared_components/Button";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { format } from "date-fns";

const RevenueCard: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const navigate = useNavigate();

  // Tạo danh sách tháng (từ tháng 1 đến tháng 12)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: `${i + 1}`,
    label: `Tháng ${i + 1}`,
  }));

  // Thêm option "Tất cả"
  months.unshift({ value: "", label: "Tất cả các tháng" });
const handleViewDetail = () => {
  let startDate = new Date();
  let endDate = new Date();

  if (selectedMonth) {
    const year = new Date().getFullYear();
    const month = parseInt(selectedMonth);

    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng
  } else {
    const year = new Date().getFullYear();
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
  }

  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(endDate, "yyyy-MM-dd");

  navigate(`/admin/statistic/revenue?start=${startStr}&end=${endStr}`);
};
  useEffect(() => {
    const loadRevenue = async () => {
      setLoading(true);
      try {
        // Xác định ngày bắt đầu và kết thúc dựa trên tháng được chọn
        let startDate = "2025-01-01";
        let endDate = "2025-12-31";

        if (selectedMonth) {
          const month = parseInt(selectedMonth);
          const year = 2025; // Có thể thay bằng năm hiện tại nếu cần
          startDate = `${year}-${month.toString().padStart(2, "0")}-01`;

          // Tính ngày cuối cùng của tháng
          const lastDay = new Date(year, month, 0).getDate();
          endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;
        }

        const revenueData = await fetchRevenueByField({
          start_date: startDate,
          end_date: endDate,
        });

        const total =
          revenueData?.reduce(
            (sum: number, item: any) => sum + item.total_revenue,
            0,
          ) || 0;

        setTotalRevenue(total);
      } catch (error) {
        console.error("Error loading revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, [selectedMonth]);

  return (
    <div className="flex flex-col justify-between items-center bg-white h-1/2 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Doanh thu năm nay </h2>
      <div className="mb-4 w-full">
        <label
          htmlFor="month-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Chọn tháng
        </label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tháng</SelectLabel>
              {months
                .filter((m) => m.value !== "")
                .map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Đang tải doanh thu...</p>
      ) : totalRevenue !== null ? (
        <p className="text-gray-800 font-bold">
          Tổng doanh thu: {totalRevenue.toLocaleString()} VND
        </p>
      ) : (
        <p>Không có dữ liệu doanh thu</p>
      )}

      <Button
        text="Xem chi tiết"
        type="primary"
        onClick={handleViewDetail}
        customStyle={{ marginTop: "10px" }}
      />
    </div>
  );
};

export default RevenueCard;
