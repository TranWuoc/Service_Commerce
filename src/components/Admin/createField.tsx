import React, { useState, useEffect } from "react";
import { InputField } from "../Shared_components/InputField";
import LocationInput from "../Shared_components/SearchLocation";
import { toast } from "../../hooks/use-toast";
import axiosInstance from "../../api/axiosInstance";
import { Field } from "../../types/Field";
import Button from "../Shared_components/Button";

interface FieldFormProps {
  onSubmit: (data: Omit<Field, "id">) => void; // Hàm xử lý khi submit
}

const FieldForm: React.FC<FieldFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Field, "id">>({
    name: "",
    address: "",
    price: 0,
    category: { id: "", name: "" },
    state: { id: "state-001", name: "Active" },
    images: [],
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [fieldData, setFieldData] = useState<File[] | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]); // Danh sách ID của các ảnh đã bị xóa
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8000/api/fields",
        );
        const fields = response.data.data;
        const allCategories = fields.map((field: any) => ({
          id: field.category.id,
          name: field.category.name,
        }));

        const uniqueCategories = Array.from(
          new Set(
            allCategories.map((c: { id: string; name: string }) => c.name),
          ),
        ).map((name) =>
          allCategories.find(
            (c: { id: string; name: string }) => c.name === name,
          ),
        );

        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kiểu sân:", error);
        setLoading(false);
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
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image selected:", e.target.files);
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast({
        title: "Error",
        description: "Bạn chỉ có thể thêm tối đa 3 ảnh.",
        variant: "destructive",
      });
      console.log("Số lượng ảnh vượt quá giới hạn: ", images.length + files.length);
      return;
    }
    const selected = files.slice(0, 3 - images.length); // Max 3 images

    setImages((prev) => [...prev, ...selected]);

    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result)
          setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLocationSelect = (data: {
    lat: number;
    lon: number;
    address: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: data.address,
      latitude: data.lat,
      longitude: data.lon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Tên sân là bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Địa chỉ sân là bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Giá sân phải là bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category.id) {
      toast({
        title: "Error",
        description: "Vui lòng chọn kiểu sân.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Mô tả sân là bắt buộc.",
        variant: "destructive",
      });
      return;
    }
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Vui lòng thêm ít nhất một ảnh mô tả sân.",
        variant: "destructive",
      });
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("price", formData.price.toString());
    form.append("description", formData.description || "");
    form.append("latitude", formData.latitude?.toString() || "");
    form.append("longitude", formData.longitude?.toString() || "");
    form.append("category_id", formData.category.id);
    form.append("state_id", formData.state.id);

    // Gửi hình ảnh
    // Thêm file ảnh mới vào FormData
    console.log("Images to upload:", images);
    images.forEach((image) => {
      console.log("Appending image:", image);
      form.append("image[]", image); // Sử dụng key đúng là `image[]`
    });

    // Gửi danh sách ID của các ảnh đã bị xóa
    if (deletedImageIds.length > 0) {
      form.append("deleted_images", JSON.stringify(deletedImageIds));
    }

    try {
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/api/fields",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast({
        title: "Success",
        description: "Đã thêm sân thành công",
        variant: "sucess",
      });
      setTimeout(() => {
        window.location.href = "/admin/manage";
      }, 1000);
      onSubmit(response.data);
    } catch (error) {
      console.error("Error submitting field:", error);
      toast({
        title: "Error",
        description: "Lỗi thêm sân! Hãy thử lại.",
        variant: "destructive",
      });
    }
    console.log("Form data submitted:", formData);
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
        onChange={handleInputChange}
      />
      <LocationInput onLocationSelect={handleLocationSelect} />
      <InputField
        label="Giá sân"
        type="text"
        placeholder="Điền giá sân ..."
        value={formData.price.toLocaleString("vi-VN") + " VNĐ"}
        required
        name="price"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[^0-9]/g, "");
          const numericValue = parseFloat(rawValue) || 0;
          setFormData({ ...formData, price: numericValue });
        }}
      />
      <InputField
        label="Kiểu sân"
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        type="select"
        placeholder="Chọn kiểu sân ..."
        value={formData.category.id}
        required
        name="category"
        style={{ marginBottom: "1.5rem" }}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedCategory = categories.find((c) => c.id === selectedId);
          if (selectedCategory) {
            setFormData((prev) => ({
              ...prev,
              category: {
                id: selectedCategory.id,
                name: selectedCategory.name,
              },
            }));
          }
        }}
      />
      <InputField
        label="Tình trạng sân"
        type="text"
        placeholder="Điền tình trạng sân ..."
        value={formData.state.name}
        required
        name="state"
        disabled={true}
        style={{ marginBottom: "1.5rem" }}
      />
      <InputField
        label="Mô tả sân"
        type="text"
        placeholder="Nhập mô tả về sân ..."
        value={formData.description || ""}
        required
        name="description"
        style={{ marginBottom: "1.5rem", height: "100px" }}
        onChange={handleInputChange}
      />
      <div className="mb-4">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Hình ảnh
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview} // URL xem trước của ảnh mới
                alt="New"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImages((prev) => prev.filter((_, i) => i !== index)); // Xóa file ảnh mới
                  setPreviews((prev) => prev.filter((_, i) => i !== index)); // Xóa URL xem trước
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          name="image"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <Button
        text="Thêm mới sân"
        type="primary"
        onClick={handleSubmit}
        customStyle={{ marginTop: "1rem", width: "100%" }}
      />
    </form>
  );
};

export default FieldForm;
