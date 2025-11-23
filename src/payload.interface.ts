import { Role } from "./role.enum";

export interface JwtPayload {
  sub: number; // User ID (changed to number to match your Student entity)
  name: string;
  email: string;
  role: Role;
}