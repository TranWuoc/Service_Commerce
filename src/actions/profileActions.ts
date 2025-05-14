
import axiosInstance from "../api/axiosInstance";
import { User } from "../types/User"; 

export const updateUserProfile = async (
  userId: string,
  formData: FormData
): Promise<User> => {
  const response = await axiosInstance.post(`/user/update/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  return response.data.data;
};

export const saveUserToLocal = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};
