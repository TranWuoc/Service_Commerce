import React, { useState, useEffect } from "react";
import { InputField } from "../Shared_components/InputField";
import axios from "axios";

interface FieldFormProps {
  initialData?: FieldData; // Dữ liệu ban đầu (nếu chỉnh sửa)
  onSubmit: (data: FieldData) => void; // Hàm xử lý khi submit
}

interface FieldData {
  name: string;
  address: string;
  category: string;
  price: number;
  state: string;
  images: File[] | string[]; // Hình ảnh có thể là file hoặc URL
}

const FieldForm: React.FC<FieldFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<FieldData>({
    name: "",
    address: "",
    category: "",
    price: 0,
    state: "Hoạt động", // Mặc định là "Hoạt động" khi thêm sân mới
    images: [],
    ...initialData, // Đổ dữ liệu nếu chỉnh sửa
  });

  const [categories, setCategories] = useState<string[]>([]); // State để lưu danh sách kiểu sân
  const [loading, setLoading] = useState<boolean>(true); // State để hiển thị trạng thái tải dữ liệu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fields"); // Gọi API để lấy danh sách sân
        const fields = response.data.data;
        const allCategories = fields.map((field: any) => field.category.name);
        // Lọc bỏ trùng lặp nếu cần
        const uniqueCategories = Array.from(new Set(allCategories));

        setCategories(uniqueCategories); // Lưu danh sách kiểu sân vào state
        setLoading(false); // Dừng trạng thái loading
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kiểu sân:", error);
        setLoading(false); // Dừng trạng thái loading ngay cả khi lỗi
      }
    };

    fetchCategories();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value, // Chuyển giá thành số
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files), // Lưu danh sách file
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Gọi hàm onSubmit với dữ liệu form
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mx-auto bg-white rounded-lg max-w-[800px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] h-auto flex flex-col mt-0 gap-1"
    >
      <InputField
        label="Tên sân"
        type="text"
        placeholder="Điền tên sân ..."
        value={formData.name}
        required
        name="name"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <InputField
        label="Địa chỉ sân"
        type="text"
        placeholder="Điền địa chỉ sân ..."
        value={formData.address}
        required
        name="address"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <InputField
        label="Giá sân"
        type="number"
        placeholder="Điền giá sân ..."
        value={formData.price}
        required
        name="price"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) =>
          setFormData({ ...formData, price: parseFloat(e.target.value) })
        }
      />
      <InputField
        label="Kiểu sân"
        options={categories.map((category) => ({
          value: category,
          label: category,
        }))} 
        type="text"
        placeholder="Điền kiểu sân ..."
        value={formData.category}
        required
        name="category"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })} // Cập nhật giá trị khi chọn kiểu sân
      />

      <InputField 
        label="Tình trạng sân" 
        type="text"
        placeholder="Điền tình trạng sân ..."
        value={formData.state}
        required
        name="state"
        style={{ marginBottom: "1.5rem" }}
        disabled={true}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
      {/* Hình ảnh */}
      <div className="mb-4">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Hình ảnh
        </label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
      >
        {initialData ? "Lưu thay đổi" : "Thêm sân"}
      </button>
    </form>
  );
};

export default FieldForm;
