import * as React from "react";
import { ProfileImage } from "./ProfileImage";

interface ProfileHeaderProps {
  name: string;
  createdAt: string; // ngày tạo user (ISO string)
  imageUrl: string;
  onImageChange?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  createdAt,
  imageUrl,
  onImageChange,
}) => {
  // Format ngày createdAt thành dạng đẹp, ví dụ: May 21, 2023
  const memberSince = React.useMemo(() => {
    if (!createdAt) return "";
    try {
      return new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return createdAt;
    }
  }, [createdAt]);

  return (
    <header className="mb-8 px-6 flex items-center gap-6">
      <ProfileImage imageUrl={imageUrl} onImageChange={onImageChange} />
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-slate-800">{name}</h1>

      </div>
    </header>
  );
};
