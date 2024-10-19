import Role, { ROLE } from '../../entities/role.entity';
import User from 'src/modules/users/entities/user.entity';

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
