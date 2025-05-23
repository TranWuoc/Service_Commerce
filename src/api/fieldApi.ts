import { Field } from "../types/Field";
import axiosInstance from "./axiosInstance";
import axios from "axios";

// Lấy ra toàn bộ danh sách sân
// export const fetchFields = async (): Promise<Field[]> => {
//   try {
//     const response = await axiosInstance.get("/fields?per_page=100");
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching fields:", error);
//     throw error;
//   }
// };

export const fetchFields = async (): Promise<Field[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/fields?per_page=100");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching fields:", error);
    throw error;
  }
};


export const fetchFieldById = async (fieldId: string) => {
  try {
    const response = await axiosInstance.get(`/fields/${fieldId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching field by ID:", error);
    throw error;
  }
};

// Lấy ra danh sách kiểu sân 
export const fetchCategories = async () => {
    const response = await axiosInstance.get("/fields");
    const fields = response.data.data;
    const allCategories = fields.map((field: any) => ({
      id: field.category.id,
      name: field.category.name,
    }));
    return Array.from(
      new Set(allCategories.map((c: { id: string; name: string }) => c.name))
    ).map((name) =>
      allCategories.find((c: { id: string; name: string }) => c.name === name)
    );
  };


export const fetchStates = async () => {
    const response = await axiosInstance.get("/fields");
    const fields = response.data.data;
    const allStates = fields.map((field: any) => ({
      id: field.state.id,
      name: field.state.name,
    }));
    return Array.from(
      new Set(allStates.map((s: { id: string; name: string }) => s.name))
    ).map((name) =>
      allStates.find((s: { id: string; name: string }) => s.name === name)
    );
  }; 
  
// Cập nhật thông tin sân
export const updateField = async (fieldId: string, formData: FormData) => {
    const response = await axiosInstance.post(
      `http://127.0.0.1:8000/api/fields/${fieldId}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

// Xóa sân
export const deleteField = async (fieldId: string) => {
    const response = await axiosInstance.delete(`/fields/${fieldId}`);
    return response.data;
  };

// Tạo sân mới
