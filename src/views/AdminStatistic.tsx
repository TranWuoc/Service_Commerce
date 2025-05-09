import React, { useEffect, useState } from "react";
// import StatisticsChart from "../components/StatisticsChart";
// import { getStatistics } from "../services/statisticsService";

const Statistics: React.FC = () => {
//   const [statistics, setStatistics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         const data = await getStatistics();
//         setStatistics(data);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu thống kê:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStatistics();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
//       {loading ? (
//         <p>Đang tải dữ liệu...</p>
//       ) : (
//         <StatisticsChart data={statistics} />
//       )}
//     </div>
//   );
    return (
        <div className="p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
        {/* Thêm mã của bạn ở đây */}
        {/* Ví dụ: <StatisticsChart data={statistics} /> */}
        </div>
    );
};

export default Statistics;