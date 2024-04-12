import { UserRole } from "@prisma/client"

export interface UserIn {
  full_name: string;
  email: string;
  phone: string;
  cpf: string;
  birth_date: Date;
  password: string;
  n_attempt?: number;
  is_admin?: boolean;
  blocked?: boolean;
  block_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  address_id?: number;
  role?: UserRole;
}

export interface UserOut {
  cpf?: string;
  id?: string;
  full_name?: string;
  address_id?: number;
  birth_date?: Date;
  n_attempt?: number;
  blocked?: boolean;
  email?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  role?: UserRole;
  password?: string;
}

export interface UserUpdate {   // Alterar senha do App
  id: string;
  password: string;
}

export interface UserLoginIn {
  cpf: string;
  password: string;
}

export interface UserLoginOut {
  id: string;
  password: string;
  blocked: boolean;
  role: UserRole;
}