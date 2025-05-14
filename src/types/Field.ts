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
    images: {
      id: string;
      image_url: string;
    }[];
    description: string;
    latitude?: number;
    longitude?: number;
  }

export interface RevenueByFieldItem {
  field_id: string;
  field: Field;
  total_revenue: number;
}
  
  export interface FieldApiResponse {
    data: Field;
    success: boolean;
    error?: string;
  }
  