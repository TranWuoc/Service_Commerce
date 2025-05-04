import { useState, useEffect } from "react";
import { TableRow } from "../Shared_components/TableRow";
import axiosInstance from "../../api/axiosInstance";
export const FieldsTable: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/user");
      ;
      console.log("Kết quả API:", res.data);
  
      const bookings = res.data.data;
      setRows(
        bookings.map((booking: any) => ({
          name: booking.field.name,
          date: formatDate(booking.date_start),
          price: booking.field.price.toLocaleString(),
          status: "Đã thuê",
          review: "Chưa có đánh giá",
        }))
      );
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đặt sân:", err);
      if (err.response) {
        console.error("Response Error:", err.response);
        console.error("Response Data:", err.response.data);
        console.error("Response Status:", err.response.status);
        console.error("Response Headers:", err.response.headers);
      }
    }
  };

  const formatDate = (datetimeString: string) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full h-[500px]">
      <div className="grid px-0 py-4 text-base font-semibold border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] text-slate-400 max-sm:gap-2 max-sm:grid-cols-[1fr]">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Tổng giá</div>
        <div>Đánh giá</div>
        <div>Trạng thái</div>
        <div>Hành động</div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-100px)]">
        {currentRows.map((row, index) => (
          <TableRow
            key={index}
            name={row.name}
            date={row.date}
            price={row.price}
            status={row.status}
            review={row.review}
          />
        ))}
      </div>
      <div className="flex justify-between items-center pt-5 text-xs text-neutral-500">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Trước
        </button>
        <div className="text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Tiếp
        </button>
      </div>
    </section>
  );
};
