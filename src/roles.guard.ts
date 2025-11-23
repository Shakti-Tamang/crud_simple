import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { AuthRequest } from './auth-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {

  } 

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);



    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    
    if (!user || !user.role) {
      console.log('No user or role found');
      return false;
    }
    
    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('User has required role:', hasRole);
    
    return hasRole;
  }
}