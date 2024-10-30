import {
  allRolesStub,
  salesRoleStub,
  afterUpdatedRoleStub,
} from '../test/stubs/role.stub';

export const RolesService = jest.fn().mockReturnValue({
  createRole: jest.fn().mockResolvedValue(salesRoleStub()),
  getAllRoles: jest.fn().mockResolvedValue(allRolesStub()),
  getRoleById: jest.fn().mockResolvedValue(salesRoleStub()),
  updateRole: jest.fn().mockResolvedValue(afterUpdatedRoleStub()),
  deleteRolePermanently: jest.fn().mockResolvedValue(salesRoleStub()),
});
