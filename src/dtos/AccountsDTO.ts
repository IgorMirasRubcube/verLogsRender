import { Prisma} from "@prisma/client";

export interface AccountIn {
    transfer_password: string;
    account_number: string;
    type: string; // create enum ACCOUNT_TYPE after
    created_at?: Date;
    updated_at?: Date;
    user_id: string;
  }
  
export interface AccountOut {
  type?: string;
  id?: string;
  account_number?: string;
  user_id?: string;
  bank?: string;
  agency?: string;
  balance?: Prisma.Decimal;
  transfer_password?: string;
  n_attempt?: number;
  blocked?: boolean;
}

export interface AccountUpdate {  // Alterar senha transacional
  id: string;
  transfer_password: string;
}