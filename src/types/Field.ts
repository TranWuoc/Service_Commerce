export interface Field {
  
    id: string;
    name: string;
    address: string;
    price: number;
    category: {
      id: string;
      name: string;
    };
    state: {
      id: string;
      name: string;
    };
    images: string[];
  
  }
  
  export interface FieldApiResponse {
    data: Field;
    success: boolean;
    error?: string;
  }
  