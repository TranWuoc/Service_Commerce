import React, { useState } from "react";
import CommentContext from "../Context/CommentContext";
import { Comment } from "../types/Comment"; 

interface Props {
  children: React.ReactNode;
}

export const CommentProvider: React.FC<Props> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);


  return (
    <CommentContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentContext.Provider>
  );
};
