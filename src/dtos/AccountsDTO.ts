import { Prisma } from "@prisma/client";

export interface AccountIn {
    transfer_password: string;
    account_number: string;
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
}

export interface AccountUpdate {  // Alterar senha transacional
  id: string;
  transfer_password: string;
}