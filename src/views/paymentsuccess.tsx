import { useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get("vnp_Amount");
  const txnRef = params.get("vnp_TxnRef");

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + " VND";
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col items-center">
        
        {/* ICON */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6 uppercase">Thanh toán thành công</h1>

        {/* Nội dung */}
        <div className="text-center text-gray-700 space-y-4 w-full">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Mã giao dịch:</p>
            <p>{txnRef}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Số tiền:</p>
            <p>{amount ? formatCurrency(Number(amount) / 100) : ''}</p>
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
