import * as React from "react";
import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import axiosInstance from "../../api/axiosInstance";
import { Comment } from "../../types/comment";
import { User } from "../../types/user";

interface CommentItemProps extends Comment {}

export const CommentItem: React.FC<CommentItemProps> = ({
  user_id,
  content,
  status,
  field_id,
  id,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${user_id}`);
        setUser(res.data);
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_id]);

  return (
    <article className="flex flex-col items-start w-full">
      <div className="flex gap-6 items-center h-[45px] text-neutral-950">
        {!loading && user && (
          <UserProfile
            imageUrl={user.avatar || "default-avatar.jpg"}
            name={user.name}
            role={user.role || "Người dùng"}
          />
        )}
      </div>

      <div className="flex flex-col items-start px-12 pt-4 pb-2 mt-1.5 ml-14 w-full font-semibold bg-zinc-300 max-w-[780px] rounded-[50px] max-md:px-5 max-md:max-w-full">
        <p className="text-base text-black">{content}</p>
        <div className="flex gap-1 mt-3 text-xs text-stone-300">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9cec473df0839e3f3c4212b90778e9706f278e9"
            alt="Calendar icon"
            className="object-contain shrink-0 aspect-[1.05] w-[21px]"
          />
          <time>{new Date().toLocaleDateString()}</time>
        </div>
      </div>
    </article>
  );
};
