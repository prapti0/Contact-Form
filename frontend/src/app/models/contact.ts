
export interface Contact {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  company: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  company: string;
}