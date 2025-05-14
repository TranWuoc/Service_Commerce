export interface Comment {
  id: string;
  fieldId: string; // fieldId là string thay vì number
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  image_url?: string;
  user?: {
    id: string; // id là string thay vì number
    name: string;
    avatar?: string; // avatar có thể là một URL hoặc không có
  };
   children?: Comment[]; 
   parentId?: string;
}
