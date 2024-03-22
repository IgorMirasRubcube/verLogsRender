export interface AddressIn {
  cep: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

// Change AddressOut later if necessary

export interface AddressOut {
  cep: string;
  street: string;
  number: string;
  complement?: string | null;    // prisma returns null if not exists (null !== undefined)
  neighborhood: string;
  city: string;
  state: string;
}