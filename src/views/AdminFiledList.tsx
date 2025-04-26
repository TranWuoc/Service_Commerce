import React, { useState, useEffect } from "react";
// import FieldTable from "../components/FieldTable";
// import { getFields } from "../services/fieldService";

const FieldList: React.FC = () => {
//   const [fields, setFields] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         const data = await getFields();
//         setFields(data);
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách sân:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFields();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Danh sách sân</h1>
//       {loading ? (
//         <p>Đang tải dữ liệu...</p>
//       ) : (
//         <FieldTable fields={fields} />
//       )}
//     </div>
//   );

    return (
        <div className="p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Danh sách sân</h1>
        {/* Thêm mã của bạn ở đây */}
        {/* Ví dụ: <FieldTable fields={fields} /> */}
        </div>
    );
};

export default FieldList;