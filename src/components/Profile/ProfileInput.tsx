// src/components/Profile/ProfileInput.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
import { useToast } from "../../hooks/use-toast";
import { useUser } from "../../hooks/useUser";
import { updateUserProfile, saveUserToLocal } from "../../actions/profileActions";

export const ProfileInput: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: contextUser, setUser } = useUser();

  const userData = React.useMemo(() => {
    return contextUser || JSON.parse(localStorage.getItem("user")) || {};
  }, [contextUser]);

  React.useEffect(() => {
    if (!userData?.id) {
      console.warn("No user data found. Redirecting...");
      navigate("/dashboard", { replace: true });
    }
  }, [userData, navigate]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [tempFormData, setTempFormData] = React.useState(userData);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;

  if (field === "phone") {
    // Chỉ cho phép số và + ở đầu
    const validPhone = value.replace(/(?!^\+)[^\d]/g, ""); // loại bỏ ký tự không phải số trừ dấu +
    if (validPhone.length > 0 && !/^(0\d{0,9}|\+84\d{0,9})$/.test(validPhone)) return;
    setTempFormData(prev => ({ ...prev, [field]: validPhone }));
  } else {
    setTempFormData(prev => ({ ...prev, [field]: value }));
  }
    
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelClick = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    setIsEditing(false);
    setTempFormData(userData);
    setAvatarFile(null);
  };

  const buildFormData = () => {
    const form = new FormData();
    form.append("name", tempFormData.name);
    form.append("email", tempFormData.email);
    form.append("phone_number", tempFormData.phone_number);
    form.append("address", tempFormData.address || "");
    if (avatarFile) form.append("avatar", avatarFile);
    return form;
  };

  const applyUpdatedUser = (updatedUser: any) => {
    setUser(updatedUser);
    setTempFormData(updatedUser);
    saveUserToLocal(updatedUser);
    setIsEditing(false);
    setAvatarFile(null);
  };

  const handleUpdateClick = async () => {
    try {
      const updatedUser = await updateUserProfile(userData.id, buildFormData());

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }

      applyUpdatedUser(updatedUser);

      toast.toast({
        variant: "success",
        title: "Thành công!",
        description: "Thông tin đã được cập nhật.",
      });
    } catch (error: any) {
      toast.toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Đã xảy ra lỗi trong quá trình cập nhật.",
      });
    }
  };

  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

const getImageUrl = () => {
  if (!userData.avatar) return "../../public/profile-image.jpg"; // hoặc trả về ảnh mặc định nếu cần

  return userData.avatar.includes("googleusercontent")
    ? userData.avatar
    : `http://localhost:8000/${userData.avatar}` || "../../public/profile-image.jpg";
};

  return (
    <section className="rounded-2xl border border-solid border-slate-100 bg-white p-4 max-w-[900px] mx-auto">

      <ProfileHeader
        name={userData.name}
        imageUrl={getImageUrl()}
      />

      {isEditing && (
        <div className="my-4 px-10">
          <label className="block font-medium mb-1">Thay ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}

      <form className="grid gap-4">
        <InputField
          label="Full Name"
          type="text"
          value={tempFormData.name}
          onChange={handleInputChange("name")}
          disabled={!isEditing}
          
        />
        <InputField
          label="Email"
          type="email"
          value={tempFormData.email}
          onChange={handleInputChange("email")}
          disabled={true} 
        />
        <InputField
          label="Phone"
          type="tel"
          value={tempFormData.phone_number}
          onChange={handleInputChange("phone_number")}
          disabled={!isEditing}
        />
        <InputField
          label="Address"
          type="text"
          value={tempFormData.address || ""}
          onChange={handleInputChange("address")}
          disabled={!isEditing}
        />
      </form>

      <div className="flex justify-end gap-4 mt-4">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            text="Sửa thông tin"
          />
        ) : (
          <>
             <Button
              onClick={handleUpdateClick}
              type="primary"
              text="Cập nhật"
            />
            <Button
              type= "secondary"
              onClick={handleCancelClick}
              text="Hủy"
            />
         
          </>
        )}
      </div>
    </section>
  );
};

export default ProfileInput;
