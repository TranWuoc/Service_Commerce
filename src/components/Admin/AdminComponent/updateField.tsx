import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Field } from "../../../types/Field";
import { InputField } from "../../Shared_components/InputField";
import { toast, useToast } from "../../../hooks/use-toast";
import LocationInput from "../../Shared_components/SearchLocation";
import axiosInstance from "../../../api/axiosInstance";
import Button from "../../Shared_components/Button";
import {
  fetchFieldById,
  fetchCategories,
  fetchStates,
  updateField,
  deleteField,
} from "../../../api/fieldApi";
import {
  handleImageSelection,
  handleImageDeletion,
  handleImageChange,
  handleDeleteImage,
} from "../../../utils/imageUtils";

const UpdateField: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [fieldData, setFieldData] = useState<Field | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const field = await fetchFieldById(fieldId!);
        const categories = await fetchCategories();
        const states = await fetchStates();
        setFieldData(field);
        setCategories(categories);
        setStates(states);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [fieldId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>  ) => {
    const { name, value } = e.target;

    if (name === "category.name") {
      const selectedCategory = categories.find(
        (category) => category.name === value,
      );
      setFieldData((prev) =>
        prev
          ? {
              ...prev,
              category: {
                ...prev.category,
                name: value,
                id: selectedCategory ? selectedCategory.id : "", // Lấy `id` từ danh sách `categories`
              },
            }
          : null,
      );
    } else if (name === "state.name") {
      const selectedState = states.find((state) => state.name === value);
      setFieldData((prev) =>
        prev
          ? {
              ...prev,
              state: {
                ...prev.state,
                name: value,
                id: selectedState ? selectedState.id : "", // Lấy `id` từ danh sách `states`
              },
            }
          : null,
      );
    } else {
      setFieldData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, images, setImages, setPreviews);
  };

  // Sử dụng hàm handleDeleteImage
  const onDeleteImage = (id: string, index: number) => {
    handleDeleteImage(id, index, setFieldData, setDeletedImageIds, setPreviews);
  };

  const handleSubmit = async () => {
    if (!fieldData) {
      toast({
        title: "Error",
        description: "Field data is not available.",
        variant: "destructive",
      });
      return;
    }
    const formData = new FormData();

    formData.append("name", fieldData.name);
    formData.append("address", fieldData.address);
    formData.append("price", String(fieldData.price));
    formData.append("description", fieldData.description || "");
    formData.append("category_id", fieldData.category.id);
    formData.append("state_id", fieldData.state.id);

    const existingImages = fieldData.images.map((image) => ({
      id: image.id,
      image_url: image.image_url,
    }));
    formData.append("existing_images", JSON.stringify(existingImages));

    // Thêm file ảnh mới vào FormData
    console.log("Images to upload:", images);
    images.forEach((image) => {
      console.log("Appending image:", image);
      formData.append("image[]", image); // Sử dụng key đúng là `image[]`
    });

    // Gửi danh sách ID của các ảnh đã bị xóa
    if (deletedImageIds.length > 0) {
      formData.append("deleted_images", JSON.stringify(deletedImageIds));
    }

    // Kiểm tra xem có ảnh nào trong formData không
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await updateField(fieldId!, formData); // Gọi API cập nhật sân
      console.log("Field updated:", response);

      toast({
        title: "Success",
        description: "Đã cập nhật sân thành công",
        variant: "success",
      });

      setTimeout(() => {
        window.location.href = "/admin/manage"; // Điều hướng sau khi cập nhật thành công
      }, 3000);
    } catch (error: any) {
      console.error("Error updating field:", error.response?.data || error);

      toast({
        title: "Error",
        description: "Lỗi cập nhật sân!! Hãy thử lại",
        variant: "destructive",
      });
      console.log("Form data submitted:", fieldData);
    }
  };

  const handleDeleteField = async () => {
    if (!fieldId) {
      toast({
        title: "Error",
        description: "Không tìm thấy ID của sân.",
        variant: "destructive",
      });
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa sân này?")) {
      try {
        await deleteField(fieldId!); // Gọi API xóa sân
        toast({
          title: "Success",
          description: "Sân đã được xóa thành công.",
          variant: "success",
        });
  
 
        setTimeout(() => {
          window.location.href = "/admin/manage"; 
        }, 3000);
      } catch (error: any) {
        console.error("Error deleting field:", error.response?.data || error);
        toast({
          title: "Error",
          description: "Lỗi khi xóa sân! Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    }
  };

  if (!fieldData) return <div>Loading...</div>;

  return (
    <div
    className="relative flex mx-auto max-w-[1000px] h-auto flex-col  rounded-xl bg-white bg-clip-border text-gray-700 shadow-md mb-3 pb-3 pl-2 pr-2"
  >
    <div
      className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 bg-clip-border text-white shadow-lg shadow-cyan-500/40"
    >
      <h3
        className="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased"
      >
        Chỉnh sửa thông tin sân
      </h3>
      </div>
      <InputField
            label="Tên sân"
            type="text"
            name="name"
            placeholder="Tên sân"
            value={fieldData.name}
            onChange={handleInputChange}
            required
            style={{ marginBottom: "1.5rem" }}
          />
          <LocationInput 
  onLocationSelect={(data) => {
    setFieldData(prev => prev ? {
      ...prev,
      address: data.address,
      latitude: data.lat,
      longitude: data.lon
    } : null);
  }}
  initialAddress={fieldData.address}
  initialCoords={{
    lat: fieldData.latitude || 0,
    lon: fieldData.longitude || 0
  }}
/>
          <InputField
            label="Giá sân"
            type="text"
            placeholder="Điền giá sân ..."
            value={fieldData.price.toLocaleString("vi-VN") + " VNĐ"}
            required
            name="price"
            style={{ marginBottom: "1.5rem" }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9]/g, "");
              const numericValue = parseFloat(rawValue) || 0;
              setFieldData((prev) =>
                prev ? { ...prev, price: numericValue } : null,
              );
            }}
          />
          <InputField
            label="Kiểu sân: "
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            type="select"
            placeholder="Chọn kiểu sân ..."
            value={fieldData.category.id}
            required
            name="category"
            style={{ marginBottom: "1.5rem" }}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedCategory = categories.find(
                (c) => c.id === selectedId,
              );
              if (selectedCategory) {
                setFieldData((prev) =>
                  prev
                    ? {
                        ...prev,
                        category: {
                          id: selectedCategory.id,
                          name: selectedCategory.name,
                        },
                      }
                    : null,
                );
              }
            }}
          />
          <InputField
            label="Tình trạng sân"
            options={states.map((state) => ({
              value: state.id,
              label: state.name,
            }))}
            type="text"
            placeholder="Điền tình trạng sân ..."
            value={fieldData.state.id}
            required
            name="state.name"
            style={{ marginBottom: "1.5rem" }}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedState = states.find((s) => s.id === selectedId);
              if (selectedState) {
                setFieldData((prev) =>
                  prev
                    ? {
                        ...prev,
                        state: {
                          id: selectedState.id,
                          name: selectedState.name,
                        },
                      }
                    : null,
                );
              }
            }}
          />
          <InputField
            label="Mô tả sân"
            type="text"
            placeholder="Nhập mô tả về sân ..."
            value={fieldData.description || ""}
            name="description"
            style={{ marginBottom: "1.5rem", height: "100px" }}
            onChange={handleInputChange}
          />
          <div className="mb-4 flex flex-col pl-[190px]">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Hình ảnh
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {/* Hiển thị ảnh cũ */}
              {fieldData?.images
                .filter(
                  (image) => typeof image === "object" && "image_url" in image,
                ) // Kiểm tra nếu ảnh là object và có `img_url`
                .map((image: { id: string; image_url: string }, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:8000/${image.image_url}`}
                      alt="Existing"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => onDeleteImage(image.id, index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
  
              {/* Hiển thị ảnh mới được chọn */}
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
          <div className="flex justify-center gap-4 mt-2 mb-5">
          <Button text="Cập nhật sân" type="primary" onClick={handleSubmit} />
          <Button text="Xóa sân" type="tertiary" onClick={handleDeleteField} />
        </div>
    </div>
  );
};

export default UpdateField;
