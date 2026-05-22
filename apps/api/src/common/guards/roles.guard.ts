import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      USER: 1,
      MODERATOR: 2,
      ADMIN: 3,
      SUPERADMIN: 4,
    };

    const userRole = user.role as UserRole;
    const userLevel = roleHierarchy[userRole] || 0;
    return requiredRoles.some((role) => userLevel >= roleHierarchy[role]);
  }
}
