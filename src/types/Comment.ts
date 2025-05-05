export interface Comment {
    id: string;
    user_id: number;
    fieldId: number;
    content: string;
    status: string;
    created_at: Date;
  }