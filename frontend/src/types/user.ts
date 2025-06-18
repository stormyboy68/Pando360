export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  user: User;
  access_token: string;
}

export interface User {
  id: string;
  user_name: string;
  phone_number: string;
  email: any;
  date_of_birth: any;
  status: "active" | "disabled";
  last_login: any;
  avatar: any;
  email_verified_at: any;
  roles: Roles[];
  servers?: server[];
}
export interface Roles {
  id?: number;
  name: string;
}
export interface server {
  id: number;
  name: string;
  panel_id: number;
  url: string;
  token_expires_at: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  meta_data: MetaData;
}

export interface MetaData {}
