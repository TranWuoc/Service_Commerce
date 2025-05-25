import * as React from "react";

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

  // Map trạng thái sang style màu
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, string> = {
    "Đã thanh toán toàn bộ": "bg-green-300 text-green-800",
    "Đã thanh toán cọc": "bg-blue-100 text-blue-600",
    "Chờ thanh toán": "bg-yellow-100 text-yellow-700",
    
    "Đã hủy": "bg-red-100 text-red-600",
    "Đã hết hạn": "bg-gray-200 text-gray-600",
    "Không xác định": "bg-gray-100 text-gray-500",
  };
  return statusMap[status.trim()] || "bg-gray-100 text-gray-500";
};

  // Xác định trạng thái hiển thị theo yêu cầu
  const getDisplayStatus = (row: any) => {
    if (row.booking_status === "cancelled_by_user" && row.status === "paid") {
      return "Đã hủy";
    }
    const isPast = isPastDate(row.rawDate);
    if (isPast) {
      return "Đã thuê";
    }
    if (row.status === "pending") {
      return "Chờ thanh toán";
    }
    if (row.status === "paid") {
      return "Đã thanh toán cọc";
    }
    // Mặc định giữ nguyên trạng thái nếu không khớp điều kiện trên
    return row.status;
  };

  return (
    <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full">
      <div className="grid py-2 text-base font-semibold border-b border-slate-100 grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] text-slate-400">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Khung giờ</div>
        <div>Tổng giá</div>
        <div>Trạng thái</div>
        <div className="text-center">Hành động</div>
      </div>
      {rows.length > 0 ? (
        rows.map((row, index) => {
          const displayStatus = getDisplayStatus(row);

          return (
            <div
              key={index}
              className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] items-center"
            >
              <div>{row.name}</div>
              <div>{row.date}</div>
              <div>{row.timeRange}</div>
              <div>{row.price.toLocaleString()}₫</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(displayStatus)}`}
                >
                  {displayStatus}
                </span>
              </div>
              <div className="flex justify-center gap-4">
                {displayStatus === "Chờ thanh toán" ? (
                  row.receiptUrl ? (
                    <a
                      href={row.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Thanh toán
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )
                ) : displayStatus === "Đã thanh toán cọc" ? (
                  row.booking_status !== "cancelled_by_user" ? (
                    <button
                      onClick={() => onCancel(row.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Hủy
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )
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
