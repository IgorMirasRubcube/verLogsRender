import { Prisma, TransferStatus } from "@prisma/client";

export interface TransferIn {
    from_account_id: string;
    to_account_id: string;
    value: Prisma.Decimal;
    description?: string;
    type?: string;
    is_scheduled?: boolean;
    schedule_date?: Date;
    status?: TransferStatus;
    created_at?: Date;
    updated_at?: Date;
}
  
export interface TransferOut {
    id?: string,
    from_account_id: string;
    to_account_id: string;
    value: Prisma.Decimal;
    description?: string;
    type?: string;
    is_scheduled?: boolean;
    schedule_date?: Date;
    status?: TransferStatus;
    created_at?: Date;
    updated_at?: Date;
}