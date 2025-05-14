  interface FieldsTableProps {
    rows: any[];
    onCancel: (id: string) => void;
  }

  export const FieldsTable: React.FC<FieldsTableProps> = ({ rows, onCancel }) => {
    const isCancelable = (dateStr: string) => {
      const startDate = new Date(dateStr);
      const nowPlus2Days = new Date();
      nowPlus2Days.setDate(nowPlus2Days.getDate() + 2);
      return startDate > nowPlus2Days;
    };

    const getStatusBadge = (status: string) => {
      const statusMap: Record<string, string> = {
        "Đã thuê": "bg-green-100 text-green-600",
        "Chưa thanh toán": "bg-yellow-100 text-yellow-700",
      };
      return statusMap[status] || "bg-gray-100 text-gray-500";
    };

    return (
      <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full">
        <div className="grid py-2 text-base font-semibold border-b border-slate-100 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] text-slate-400">
          <div>Tên sân</div>
          <div>Ngày đặt</div>
          <div>Tổng giá</div>
          <div>Đánh giá</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </div>

        {rows.length > 0 ? (
          rows.map((row, index) => (
            <div
              key={index}
              className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] items-center"
            >
              <div>{row.name}</div>
              <div>{row.date}</div>
              <div>{row.price.toLocaleString()}₫</div>
              <div>{row.review}</div>

              <div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(row.status)}`}>
                  {row.status}
                </span>
              </div>

              <div>
                {row.status === "Chưa thanh toán" && row.receiptUrl ? (
                  <button
                    onClick={() => window.open(row.receiptUrl, "_blank")}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Thanh toán
                  </button>
                ) : isCancelable(row.rawDate) ? (
                  <button
                    onClick={() => onCancel(row.id)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Hủy
                  </button>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">Không có dữ liệu</div>
        )}
      </section>
    );
  };
