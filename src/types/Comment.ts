export interface Comment {
    id: number;
    user_id: number;
    field_id: number;
    content: string;
    status: string;
    created_at: Date;
  }