export interface UserIn {
  full_name: string;
  email: string;
  phone: string;
  cpf: string;
  birth_date: Date;
  password: string;
  transaction_password: string;
}

export interface UserOut {
  id: number;
  email: string;
  full_name: string | null;
}