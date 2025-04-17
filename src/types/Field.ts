export interface FieldInfo {
    id: string;
    name: string;
    price: string;
    type: string;
    status: string;
    imageUrl: string;
    location: string;
  }
  
  export interface FieldApiResponse {
    data: FieldInfo;
    success: boolean;
    error?: string;
  }
  