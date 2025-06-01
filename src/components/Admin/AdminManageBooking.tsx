import React, { useEffect, useState } from "react";
import { fetchFields } from "../../api/fieldApi";
import { Field } from "../../types/Field";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";

const AdminManageBooking: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const rowsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const loadFields = async () => {
      try {
        const data = await fetchFields();
        setFields(data);
      } catch (err) {
        setError("Failed to fetch fields");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, []);

  const handleViewRevenue = (fieldId: string) => {
    navigate(`/admin/statistic/revenue/${fieldId}`);
  };

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase()) ||
    field.category.name.toLowerCase().includes(search.toLowerCase()),
);

  const totalItems = filteredFields.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const currentFields = filteredFields.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
         <div className="p-4">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sân hoặc kiểu sân..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded mb-4"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kiểu sân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá sân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentFields.map((field) => (
              <tr key={field.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {field.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {field.category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      field.state.name === "Active"
                        ? "bg-green-100 text-green-800"
                        : field.state.name === "Maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : field.state.name === "Suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {field.state.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {field.price.toLocaleString()} VND
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRevenue(field.id);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phần phân trang */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Hiển thị từ{" "}
              <span className="font-medium">
                {(currentPage - 1) * rowsPerPage + 1}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(currentPage * rowsPerPage, totalItems)}
              </span>{" "}
              trong tổng số <span className="font-medium">{totalItems}</span>{" "}
              sân
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>

              {/* Hiển thị số trang */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage ? "bg-blue-600 text-white" : ""
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageBooking;
