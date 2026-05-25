import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const roleHierarchy: Record<string, number> = {
      USER: 1,
      MODERATOR: 2,
      ADMIN: 3,
      SUPERADMIN: 4,
    };

    const userLevel = roleHierarchy[user.role] || 0;
    return requiredRoles.some((role) => userLevel >= roleHierarchy[role]);
  }
}
