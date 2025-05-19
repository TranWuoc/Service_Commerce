import React, { useEffect, useState } from "react";
import { useField } from "../../hooks/useField";
import axios from "axios";
import { Field } from "../../types/Field";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import Button from "../Shared_components/Button";

const AdminManageFields: React.FC = () => {
  const { fields, setFields } = useField();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFields, setFilteredFields] = useState<Field[]>([]);
  const navigate = useNavigate();
  const { setSelectedField } = useField();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/fields?per_page=100")
      .then((response) => {
        const fieldList: Field[] = response.data.data;
        const dataWithUsage = fieldList.map((field) => ({
          ...field,
          usage: Math.floor(Math.random() * 100),
        }));
        setFields(dataWithUsage);
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
      });
  }, [setFields]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFields(fields);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = fields.filter(
        (field) =>
          field.name.toLowerCase().includes(lowercasedSearchTerm) ||
          field.address.toLowerCase().includes(lowercasedSearchTerm) ||
          field.price.toString().includes(lowercasedSearchTerm),
      );
      setFilteredFields(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, fields]);

  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFields.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);

  const handleFieldClick = (field: Field) => {
    setSelectedField(field);
    navigate("/admin/manage/FieldInfo");
  };

  const handleAddField = () => {
    navigate("/admin/manage/addField");
  };

  const shortenAddress = (address: string): string => {
    const parts = address.split(",");
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}`;
    }
    return address;
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-4 gap-5 flex flex-row w-full">
        <div className="relative flex items-center w-1/2">
          <Input
            placeholder="Nhập tên, địa chỉ hoặc giá sân"
            className="pr-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
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
        <Button text="Thêm mới sân" type="primary" onClick={handleAddField} />
      </div>

      {filteredFields.length === 0 ? (
        <p>Không có sân nào phù hợp với tìm kiếm.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((field) => (
              <div
                key={field.id}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => handleFieldClick(field)}
              >
                <h2 className="text-lg font-bold text-gray-800">
                  {field.name}
                </h2>
                <p className="text-gray-600">
                  Địa chỉ: {shortenAddress(field.address)}
                </p>
                <p className="text-gray-600">Kiểu sân: {field.category.name}</p>
                <p className="text-gray-600">
                  Giá: {field.price.toLocaleString()} VND
                </p>
                <p className="text-gray-600">
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                >
                  &lt;
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                >
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminManageFields;
