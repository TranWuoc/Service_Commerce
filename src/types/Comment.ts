export interface Comment {
  id: string;
  user_id: number;
  fieldId: number;
  content: string;
  status: string;
  createdAt: string; 
  image_url?: string;
  user?: {
    id: number;
    name: string;
    
  };
}
