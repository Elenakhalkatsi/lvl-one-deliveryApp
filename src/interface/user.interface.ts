import { Role } from 'src/enum/roles.enum';

export interface User {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  hash?: string;
  userRole?: Role;
  deleted?: boolean;
}
