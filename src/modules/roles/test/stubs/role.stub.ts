import Role, { ROLE } from '../../entities/role.entity';

export const adminRoleStub = (): Role =>
  ({
    id: 1,
    name: ROLE.ADMIN,
    description: 'Admin',
  }) as unknown as Role;

export const salesRoleStub = (): Role =>
  ({
    id: 2,
    name: ROLE.SALES,
    description: 'Sales',
  }) as unknown as Role;

export const accountantRoleStub = (): Role =>
  ({
    id: 3,
    name: ROLE.ACCOUNTANT,
    description: 'Accountant',
  }) as unknown as Role;

export const allRolesStub = (): Role[] =>
  [adminRoleStub(), salesRoleStub(), accountantRoleStub()] as unknown as Role[];
