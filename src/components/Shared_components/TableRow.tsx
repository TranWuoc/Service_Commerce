import * as React from "react";

interface TableRowProps {
  name: string;
  date: string;
  timeRange: string;
  price: number;
  depositPrice: number;
  displayStatus: string;
  receiptUrl?: string;
  bookingStatus?: string;
  onCancel: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  name,
  date,
  timeRange,
  price,
  depositPrice,
  displayStatus,
  receiptUrl,
  bookingStatus,
  onCancel,
}) => {
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

  return (
    <div className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_2fr] items-center">
      <div>{name}</div>
      <div>{date}</div>
      <div>{timeRange}</div>
      <div>{price?.toLocaleString()}₫</div>
      <div>{depositPrice?.toLocaleString()}₫</div>
      <div>
        <span
          className={`px-0 py-2 rounded-[10px] whitespace-nowrap text-xs font-medium ${getStatusBadge(displayStatus)}`}
        >
          {displayStatus}
        </span>
      </div>
      <div className="flex justify-center gap-4">
        {displayStatus === "Chờ thanh toán" ? (
          receiptUrl ? (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Thanh toán
            </a>
          ) : (
            <span className="text-gray-400">—</span>
          )
        ) : displayStatus === "Đã thanh toán cọc" &&
          bookingStatus !== "cancelled_by_user" ? (
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Hủy
          </button>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </div>
  );
};
