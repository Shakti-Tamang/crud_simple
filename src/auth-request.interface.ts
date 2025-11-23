// interfaces/auth-request.interface.ts
import { Request } from 'express';
import { JwtPayload } from './payload.interface';

export interface AuthRequest extends Request {
  user: JwtPayload;
}