import React from "react";


const StatisticField: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Thống kê sân</h2>
            <p className="text-gray-600">Thông tin thống kê sân</p>
        </div>
        <div className="flex flex-col gap-4">
            {/* Thêm các thành phần thống kê ở đây */}
        </div>
        </div>
    );
    }
export default StatisticField;