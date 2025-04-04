export interface FieldInfo {
    id: string;
    name: string;
    price: string;
    type: string;
    status: string;
    imageUrl: string;
    address: string;
  }
  
  export interface FieldApiResponse {
    data: FieldInfo;
    success: boolean;
    error?: string;
  }
  