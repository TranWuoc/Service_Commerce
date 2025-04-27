import { useContext } from "react";
import CommentContext from "../Context/CommentContext";

const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment phải được dùng bên trong CommentProvider");
  }
  return context;
};

export default useComment;