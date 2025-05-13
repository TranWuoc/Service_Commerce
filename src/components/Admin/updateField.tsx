import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Field } from "../../types/Field";
import { InputField } from "../Shared_components/InputField";
import { toast, useToast } from "../../hooks/use-toast";

import axiosInstance from "../../api/axiosInstance";
import Button from "../Shared_components/Button";
const UpdateField: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [fieldData, setFieldData] = useState<Field | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/fields/${fieldId}`)
      .then((response) => {
        console.log("Field data:", response.data);
        const { data } = response.data;
        console.log("Images data:", data.images);
        data.images.forEach((img: { id: string; image_url: string }) => {
          console.log("Image URL:", img.image_url);
        });
        setFieldData({
          ...data,
          images: data.images.map((img: { id: string; image_url: string }) => ({
            id: img.id,
            image_url: img.image_url,
          })),
        });
        console.log("Images:", fieldData);
      })
      .catch((error) => console.error("Error fetching field data:", error));
  }, [fieldId]);

  // Gọi API để lấy danh sách kiểu sân
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fields");
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

  // Gọi API để lấy danh sách states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fields");
        const fields = response.data.data;
        const allStates = fields.map((field: any) => ({
          id: field.state.id,
          name: field.state.name,
        }));
        const uniqueStates = Array.from(
          new Set(allStates.map((s: { id: string; name: string }) => s.name)),
        ).map((name) =>
          allStates.find((s: { id: string; name: string }) => s.name === name),
        );
        console.log("Unique states:", uniqueStates);
        setStates(uniqueStates);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image selected:", e.target.files);
    const files = Array.from(e.target.files || []);
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
  const handleDeleteImage = (id: string, index: number) => {
    setFieldData((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((image) => image.id !== id),
          }
        : null,
    );
    setDeletedImageIds((prev) => [...prev, id]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    axiosInstance
      .post(
        `http://127.0.0.1:8000/api/fields/${fieldId}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )

      .then((response) => {
        console.log("Field updated:", response.data);
        toast({
          title: "Success",
          description: "Đã cập nhật sân thành công",
          variant: "sucess",
        });
        setTimeout(() => {
          window.location.href = "/admin/manage";
        }, 3000);
      })
      .catch((error) => {
        console.error("Error updating field:", error.response?.data || error);
        toast({
          title: "Error",
          description: "Lỗi cập nhật sân!! Hãy thử lại",
          variant: "destructive",
        });
      });
    console.log("Form data submitted:", fieldData);
  };

  const handleDeleteField = () => {
    if (!fieldId) {
      toast({
        title: "Error",
        description: "Không tìm thấy ID của sân.",
        variant: "destructive",
      });
      return;
    }
  
    // Hiển thị xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa sân này?")) {
      return;
    }
  
    axiosInstance
      .delete(`http://127.0.0.1:8000/api/fields/${fieldId}`)
      .then((response) => {
        console.log("Field deleted:", response.data);
        toast({
          title: "Success",
          description: "Sân đã được xóa thành công.",
          variant: "sucess",
        });
  
 
        setTimeout(() => {
          window.location.href = "/admin/manage"; 
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting field:", error.response?.data || error);
        toast({
          title: "Error",
          description: "Lỗi khi xóa sân! Vui lòng thử lại.",
          variant: "destructive",
        });
      });
  };

  if (!fieldData) return <div>Loading...</div>;

  return (
    <div className="p-6 mx-auto bg-white rounded-lg max-w-[800px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] h-auto flex flex-col mt-0 gap-1">
    <form
      onSubmit={handleSubmit}
      // className="p-6 mx-auto bg-white rounded-lg max-w-[800px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] h-auto flex flex-col mt-0 gap-1"
    >
      <InputField
        label="Tên sân"
        type="text"
        name="name"
        value={fieldData.name}
        onChange={handleInputChange}
        required
        style={{ marginBottom: "1.5rem" }}
      />
      <InputField
        label="Địa điểm sân"
        type="text"
        name="address"
        value={fieldData.address}
        onChange={handleInputChange}
        required
        style={{ marginBottom: "1.5rem" }}
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
        label="Kiểu sân"
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
          const selectedCategory = categories.find((c) => c.id === selectedId);
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
      <div>
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
                  onClick={() => handleDeleteImage(image.id, index)}
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
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </form>
      <div className="flex justify-center gap-4 mt-2 mb-5">
      {/* <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
      >
        Cập nhật sân
      </button> */}
      <Button
      text="Cập nhật sân"
      type="primary"
      onClick={handleSubmit}
      />
      <Button
      text="Xóa sân"
      type="tertiary"
      onClick={handleDeleteField}
      />
      </div>
    </div>
  );
};

export default UpdateField;
