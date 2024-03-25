export interface AccountIn {
    transaction_password: string;
    account_number: string;
    created_at?: Date;
    updated_at?: Date;
    user_id: string;
  }
  
export interface AccountOut {
    id: string;
    account_number?: string;
  }