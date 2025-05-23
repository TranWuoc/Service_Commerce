import { useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get("vnp_Amount");
  const txnRef = params.get("vnp_TxnRef");
  const transactionStatus = params.get("vnp_TransactionStatus");
  const payDate = params.get("vnp_PayDate"); 

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN") + " VND";
  };

  // Hàm format ngày từ định dạng vnp_PayDate, giả sử dạng "YYYYMMDDHHmmss"
  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr.length < 14) return "";
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const isSuccess = transactionStatus === "00";

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col items-center">
        {/* ICON */}
        <div className="text-6xl mb-4">{isSuccess ? "🎉" : "⚠️"}</div>

        {/* Tiêu đề */}
        <h1
          className={`text-2xl font-bold text-center mb-6 uppercase ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess
            ? "Thanh toán thành công"
            : "Chưa thanh toán thành công, vui lòng kiểm tra lại"}
        </h1>

        {/* Nội dung */}
        <div className="text-center text-gray-700 space-y-4 w-full">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Mã giao dịch:</p>
            <p>{txnRef || "-"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Số tiền:</p>
            <p>{amount ? formatCurrency(Number(amount) / 100) : "-"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Ngày thanh toán:</p>
            <p>{formatDate(payDate) || "-"}</p>
          </div>
        </div>

        {/* Nút quay về */}
        <div className="mt-8 w-full">
          <a
            href="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 w-full block text-center rounded-full transition-all duration-300"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
