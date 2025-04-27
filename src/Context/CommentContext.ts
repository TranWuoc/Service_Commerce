import { createContext } from "react";
import { Comment } from "../types/Comment"; 

interface CommentContextType {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  addComment: (comment: Comment) => void;
  removeComment: (id: number) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export default CommentContext;