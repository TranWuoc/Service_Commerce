import { useState } from "react";
import { TableRow } from "../Shared_components/TableRow";

export const FieldsTable: React.FC = () => {
  const rows = [
    {
      name: "Tên sân 1",
      date: "dd/mm/yy",
      price: "1500.00",
      status: "Đang chờ",
      review: "Sân rất đẹp, sạch sẽ và thoáng mát.",
    },
    {
      name: "Tên sân 2",
      date: "dd/mm/yy",
      price: "2500.00",
      status: "Đã thuê",
      review: "Sân hơi nhỏ nhưng dịch vụ tốt.",
    },
    {
      name: "Tên sân 3",
      date: "dd/mm/yy",
      price: "450.00",
      status: "Đang chờ",
      review: "Giá cả hợp lý, nhân viên thân thiện.",
    },
    {
      name: "Tên sân 4",
      date: "dd/mm/yy",
      price: "552.00",
      status: "Đã thuê",
      review: "Sân không được bảo trì tốt lắm.",
    },
    {
      name: "Tên sân 5",
      date: "dd/mm/yy",
      price: "1150.00",
      status: "Đang chờ",
      review: "Rất hài lòng với trải nghiệm tại đây.",
    },
    {
      name: "Tên sân 6",
      date: "dd/mm/yy",
      price: "917.00",
      status: "Đã thuê",
      review: "Sân ổn, nhưng cần cải thiện ánh sáng.",
    },
    {
      name: "Tên sân 7",
      date: "dd/mm/yy",
      price: "1200.00",
      status: "Đang chờ",
      review: "Dịch vụ rất tốt, sẽ quay lại lần sau.",
    },
    {
      name: "Tên sân 8",
      date: "dd/mm/yy",
      price: "800.00",
      status: "Đã thuê",
      review: "Sân hơi xa trung tâm nhưng giá tốt.",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán các hàng cần hiển thị
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  // Tổng số trang
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
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
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Tiếp
        </button>
      </div>
    </section>
  );
};