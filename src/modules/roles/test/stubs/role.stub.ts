import { ROLES } from '../../../../utils/types/definitions';
import Role from '../../entities/role.entity';

export const adminRoleStub = (): Role =>
  ({
    id: 1,
    name: ROLES.ADMIN,
    description: 'Admin',
  }) as unknown as Role;

export const salesRoleStub = (): Role =>
  ({
    id: 2,
    name: ROLES.SALES,
    description: 'Sales',
  }) as unknown as Role;

export const accountantRoleStub = (): Role =>
  ({
    id: 3,
    name: ROLES.ACCOUNTANT,
    description: 'Accountant',
  }) as unknown as Role;

export const allRolesStub = (): Role[] =>
  [adminRoleStub(), salesRoleStub(), accountantRoleStub()] as unknown as Role[];
