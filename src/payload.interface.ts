import { Role } from "./role.enum";

export interface JwtPayload {
  sub: number; 
  name: string;
  email: string;
  role: Role;
}