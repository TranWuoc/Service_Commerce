import React, { useEffect, useState } from "react";
import { useField } from "../hooks/useField";
import axios from "axios";
import { Field } from "../types/Field";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import Button from "../components/Shared_components/Button";
const ManageFields: React.FC = () => {
  const { fields, setFields } = useField(); // Lấy dữ liệu từ FieldContext
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu giá trị tìm kiếm
  const [filteredFields, setFilteredFields] = useState<Field[]>([]); // State để lưu danh sách sân đã lọc
  const navigate = useNavigate(); 
  const { setSelectedField } = useField(); 
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/fields?per_page=100") // Gọi API để lấy danh sách sân
      .then((response) => {
        const fieldList: Field[] = response.data.data; // Đảm bảo response là mảng kiểu Field

        // Thêm usage ngẫu nhiên vào từng sân
        const dataWithUsage = fieldList.map((field) => ({
          ...field,
          usage: Math.floor(Math.random() * 100),
        }));

        setFields(dataWithUsage); // Cập nhật state với toàn bộ danh sách sân
        console.log(dataWithUsage); // In ra dữ liệu để kiểm tra
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
      });
  }, [setFields]);

  // Lọc dữ liệu khi người dùng nhập vào ô tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Nếu không có giá trị tìm kiếm, hiển thị toàn bộ danh sách sân
      setFilteredFields(fields);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = fields.filter(
        (field) =>
          field.name.toLowerCase().includes(lowercasedSearchTerm) || // Tìm theo tên sân
          field.address.toLowerCase().includes(lowercasedSearchTerm) || // Tìm theo địa chỉ
          field.price.toString().includes(lowercasedSearchTerm), // Tìm theo giá
      );
      setFilteredFields(filtered);
    }
  }, [searchTerm, fields]);
  const handleFieldClick = (field: Field) => {
    setSelectedField(field);
    navigate("/admin/manage/FieldInfo");
    };

  const handleAddField = () => {
    navigate("/admin/manage/addField"); // Điều hướng đến trang thêm sân
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-4 gap-5 flex flex-row w-full">
        <div className="relative flex items-center w-1/2">
          <Input
            placeholder="Nhập tên, địa chỉ hoặc giá sân"
            className="pr-10 bg-white"
            value={searchTerm} // Giá trị của ô input
            onChange={(e) => setSearchTerm(e.target.value)} // Lắng nghe sự kiện nhập liệu
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {/* Icon tùy ý */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
              />
            </svg>
          </span>
        </div>
        <Button
        text="Thêm mới sân"
        type="primary"
        onClick={handleAddField}
        />
      </div>

      {/* Hiển thị dữ liệu */}
      {filteredFields.length === 0 ? (
        <p>Không có sân nào phù hợp với tìm kiếm.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                handleFieldClick(field); // Gọi hàm khi nhấp vào sân
              }}
            >
              <h2 className="text-lg font-bold text-gray-800">{field.name}</h2>
              <p className="text-gray-600">Địa chỉ: {field.address}</p>
              <p className="text-gray-600">Kiểu sân {field.category.name}</p>
              <p className="text-gray-600">
                Giá: {field.price.toLocaleString()} VND
              </p>
              <p className="text-gray-600">
                {" "}
                <span
                  className={`inline-block w-16 h-3 rounded ${
                    field.state.name === "Active"
                      ? "bg-green-500"
                      : field.state.name === "Maintenance"
                        ? "bg-amber-400"
                        : field.state.name === "Deactivated"
                          ? "bg-red-600"
                          : field.state.name === "Suspended"
                            ? "bg-gray-400"
                            : "bg-gray-500"
                  }`}
                ></span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFields;
