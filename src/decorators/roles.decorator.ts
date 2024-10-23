import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../utils/types/definitions';

export const ROLES_DECORATOR = 'roles';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_DECORATOR, roles);
