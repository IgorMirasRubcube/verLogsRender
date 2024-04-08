export interface AddressIn {
  cep: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  created_at?: Date;
  updated_at?: Date;
}

// Change AddressOut later if necessary

export interface AddressOut {
  id?: number;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string | null;    // prisma returns null if not exists (null !== undefined)
  neighborhood?: string;
  city?: string;
  state?: string;
}