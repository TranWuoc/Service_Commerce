import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../hooks/use-toast";
export const ProfileInput: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const  toast  = useToast();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  

  React.useEffect(() => {
    if (!userData) {
      console.warn("No user data found in localStorage. Redirecting...");
      navigate("/dashboard", { replace: true });
    }
  }, [userData, navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const [formData, setFormData] = React.useState(userData);
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempFormData, setTempFormData] = React.useState(userData);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const handleInputChange =
    (field: keyof typeof userData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempFormData(formData);
    setAvatarFile(null);
  };

  const handleUpdateClick = async () => {
    try {
      const form = new FormData();
      form.append("name", tempFormData.name);
      form.append("email", tempFormData.email);
      form.append("phone", tempFormData.phone);
      form.append("address", tempFormData.address || "");
      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      await axiosInstance.post(
        `/user/update/${userData.user_id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData(tempFormData);
      setIsEditing(false);
      setAvatarFile(null);
      toast.toast({
        variant: "success",
        title: "Thành công!",
        description: "Thông tin đã được cập nhật.",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  return (
    <section className="rounded-2xl border border-solid border-slate-100 bg-white p-6">
      <ProfileHeader
        name={formData.name}
        memberSince="January 2024"
        imageUrl={
          avatarFile
            ? URL.createObjectURL(avatarFile)
            : formData.avatar || "profile-image.jpg"
        }
        onImageChange={() => {}}
      />
      {isEditing && (
        <div className="my-4">
          <label className="block font-medium mb-1">Thay ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
            onClick={handleEditClick}
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
