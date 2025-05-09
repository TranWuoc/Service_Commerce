import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";

export const ProfileInput: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = location.state;

  React.useEffect(() => {
    if (!userData) {
      console.warn("No user data found in location.state. Redirecting...");
      navigate("/dashboard", { replace: true });
    }
  }, [userData, navigate]);

  if (!userData) {
    return <div>Loading...</div>; // Hoặc hiển thị thông báo lỗi
  }

  const [formData, setFormData] = React.useState(userData);
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempFormData, setTempFormData] = React.useState(userData);

  const handleInputChange =
    (field: keyof typeof userData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleImageChange = () => {
    console.log("Change image clicked");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempFormData(formData); // Quay lại dữ liệu ban đầu
  };

  const handleUpdateClick = () => {
    setIsEditing(false);
    setFormData(tempFormData); // Cập nhật dữ liệu mới
    console.log("Updated data:", tempFormData); // Bạn có thể gọi API để lưu thay đổi ở đây
  };

  return (
    <section className="rounded-2xl border border-solid border-slate-100 bg-white p-6">
      <ProfileHeader
        name={formData.name} 
        memberSince="January 2024"
        imageUrl="profile-image.jpg"
        onImageChange={handleImageChange}
      />
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
