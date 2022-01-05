// import { Companies } from './invoice/companies.interface';

export interface User {
  id: number;
  name: string;
  surname: string;
  family: string;
  roleType: Role_Types;
  secondRoleType: Role_Types;
  voted: boolean;
  eVoted: boolean;
}

export interface Role_Types {
  value: string;
  description: string;
}
