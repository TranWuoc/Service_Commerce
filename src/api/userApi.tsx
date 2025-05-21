import React from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "../hooks/use-toast"; 
export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get(
      "http://127.0.0.1:8000/api/user/getAllUser",
    );
    return response.data.data; // Trả về dữ liệu người dùng
  } catch (error: any) {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive",
    });
  }
};


