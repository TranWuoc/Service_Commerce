import React, { useState, useEffect } from "react";
import { InputField } from "../../Shared_components/InputField";
import LocationInput from "../../Shared_components/SearchLocation";
import { toast } from "../../../hooks/use-toast";
import axiosInstance from "../../../api/axiosInstance";
import { Field } from "../../../types/Field";
import Button from "../../Shared_components/Button";
import { fetchCategories } from "../../../api/fieldApi";
import { handleImageChange } from "../../../utils/imageUtils";
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

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [images, setImages] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]); 
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, images, setImages, setPreviews);
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

  const handleSubmit = async () => {
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
        variant: "success2",
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
    <div className="relative flex mx-auto max-w-[1000px] h-auto flex-col  rounded-xl bg-white bg-clip-border text-gray-700 shadow-md mb-3 pb-3 pl-2 pr-2">
      <div className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 bg-clip-border text-white shadow-lg shadow-cyan-500/40">
        <h3 className="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased">
          Thêm mới sân
        </h3>
      </div>
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
        onChange={handleInputChange}
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
      <div className="mb-4 flex flex-col pl-[190px] ">
        <label
          htmlFor="images"
          className="self-start mb-2 text-xl text-black max-sm:text-xl"
        >
          Hình ảnh
        </label>
        <div className="mb-4 flex flex-wrap gap-2  ">
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
          onChange={onImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <Button
          text="Thêm mới sân"
          type="primary"
          onClick={handleSubmit}
          customStyle={{ width: "30%" }}
        />
      </div>
    </div>
  );
};

export default FieldForm;
