import React, { useState } from "react";
import CommentContext from "../Context/CommentContext";
import { Comment } from "../types/Comment"; 

interface Props {
  children: React.ReactNode;
}

export const CommentProvider: React.FC<Props> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const removeComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CommentContext.Provider value={{ comments, setComments, addComment, removeComment }}>
      {children}
    </CommentContext.Provider>
  );
};
