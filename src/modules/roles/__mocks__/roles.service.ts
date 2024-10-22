import {
  allRolesStub,
  salesRoleStub,
  accountantRoleStub,
} from '../test/stubs/role.stub';

export const RolesService = jest.fn().mockReturnValue({
  createRole: jest.fn().mockResolvedValue(salesRoleStub()),
  getAllRoles: jest.fn().mockResolvedValue(allRolesStub()),
  getRoleById: jest.fn().mockResolvedValue(salesRoleStub()),
});
