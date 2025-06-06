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
    setTempFormData(prev => ({ ...prev, [field]: e.target.value }));
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
    form.append("phone", tempFormData.phone);
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
    if (avatarPreview) return avatarPreview;
    return userData.avatar ? `http://localhost:8000/${userData.avatar}` : "profile-image.jpg";
  };

  return (
    <section className="rounded-2xl border border-solid border-slate-100 bg-white p-6">
      <ProfileHeader
        name={tempFormData.name}
        memberSince="January 2024"
        imageUrl={getImageUrl()}
        onImageChange={() => {}}
      />

      {isEditing && (
        <div className="my-4">
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
          disabled={!isEditing}
        />
        <InputField
          label="Phone"
          type="tel"
          value={tempFormData.phone}
          onChange={handleInputChange("phone")}
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
              onClick={handleCancelClick}
              className="bg-gray-500 hover:bg-gray-600 text-white"
              text="Hủy"
            />
            <Button
              onClick={handleUpdateClick}
              className="bg-green-500 hover:bg-green-600 text-white"
              text="Cập nhật"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default ProfileInput;
