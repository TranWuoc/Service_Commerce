interface FieldsTableProps {
  rows: any[];
  onCancel: (id: string) => void;
}

export const FieldsTable: React.FC<FieldsTableProps> = ({ rows, onCancel }) => {
  const isPastDate = (dateStr: string) => {
    const bookingDate = new Date(dateStr);
    const now = new Date();
    return bookingDate < now;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      "Đã thanh toán cọc": "bg-blue-100 text-blue-600",
      "Chưa thanh toán cọc": "bg-yellow-100 text-yellow-700",
      "Đã thanh toán": "bg-blue-100 text-blue-600",
      "Đã thuê": "bg-green-200 text-green-600",
    };
    return statusMap[status.trim()] || "bg-gray-100 text-gray-500";
  };

  return (
<section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full">
      <div className="grid py-2 text-base font-semibold border-b border-slate-100 grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] text-slate-400">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Khung giờ</div> {/* ✅ thêm cột khung giờ */}
        <div>Tổng giá</div>
        <div>Trạng thái</div>
        <div className="text-center">Hành động</div>
      </div>
  {rows.length > 0 ? (
    rows.map((row, index) => {
      const isPast = isPastDate(row.rawDate);
      const displayStatus = isPast ? "Đã thuê" : row.status?.trim();

      return (
          <div
            key={index}
            className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] items-center"
          >
            <div>{row.name}</div>
            <div>{row.date}</div> {/* ngày riêng */}
            <div >{row.timeRange}</div> 
            <div>{row.price.toLocaleString()}₫</div>
            <div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(displayStatus)}`}
              >
                {displayStatus}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              {!isPast && displayStatus !== "Đã thuê" ? (
                <>
                  <button
                    onClick={() => onCancel(row.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Hủy
                  </button>
                  {displayStatus === "Chưa thanh toán cọc" && row.receiptUrl && (
                    <a
                      href={row.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Thanh toán
                    </a>
                  )}
                </>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          </div>
      );
    })
  ) : (
    <div className="text-center text-gray-400 py-10">Không có dữ liệu</div>
  )}
</section>
  );
};
