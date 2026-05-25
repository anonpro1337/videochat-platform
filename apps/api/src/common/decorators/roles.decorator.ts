import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
