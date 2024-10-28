import {
  allPermissionStub,
  canCreateCustomerPermissionStub,
  canReadCustomerPermissionStub,
} from '../test/stubs/permission.stub';

export const PermissionsService = jest.fn().mockReturnValue({
  createPermission: jest
    .fn()
    .mockResolvedValue(canReadCustomerPermissionStub()),

  getAllPermissions: jest.fn().mockResolvedValue(allPermissionStub()),

  getPermissionById: jest
    .fn()
    .mockResolvedValue(canReadCustomerPermissionStub()),

  updatePermission: jest
    .fn()
    .mockResolvedValue(canCreateCustomerPermissionStub()),

  deletePermissionPermanently: jest
    .fn()
    .mockResolvedValue(canReadCustomerPermissionStub()),
});
