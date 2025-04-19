export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
    address: string;
    status: string;
    is_admin: boolean;
  }