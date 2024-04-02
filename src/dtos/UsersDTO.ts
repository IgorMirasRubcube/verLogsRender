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
}

export interface UserOut {
  id: string;
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
}