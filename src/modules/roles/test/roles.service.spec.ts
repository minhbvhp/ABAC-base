import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Role from '../entities/role.entity';
import {
  afterUpdatedRoleStub,
  allRolesStub,
  salesRoleStub,
} from './stubs/role.stub';
import { createSalesRoleDto, updateSalesRoleDto } from './dto/mock-role.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import Permission from '../../permissions/entities/permission.entity';
import {
  canCreateCustomerPermissionStub,
  canReadCustomerPermissionStub,
} from '../../permissions/test/stubs/permission.stub';

const mockRoleRepository = {
  findOne: jest.fn().mockResolvedValue(salesRoleStub()),
  create: jest.fn().mockResolvedValue(salesRoleStub()),
  insert: jest.fn(),
  find: jest.fn().mockResolvedValue(allRolesStub()),
  update: jest.fn().mockResolvedValue(afterUpdatedRoleStub()),
  remove: jest.fn(),
  save: jest.fn().mockResolvedValue(salesRoleStub()),
};

const mockPermissionRepository = {
  findOne: jest.fn().mockResolvedValue(canReadCustomerPermissionStub()),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

describe('RolesService', () => {
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  describe('createRole', () => {
    it('should return null if role existed', async () => {
      //arrange

      //act
      const result = await rolesService.createRole(createSalesRoleDto);

      //assert
      expect(result).toEqual(null);
    });

    it('should create new role and return its data', async () => {
      //arrange
      jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await rolesService.createRole(createSalesRoleDto);

      //assert
      expect(result).toEqual(salesRoleStub());
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      //arrange

      //act
      const result = await rolesService.getAllRoles();

      //assert
      expect(result).toEqual(allRolesStub());
    });
  });

  describe('getRoleById', () => {
    it('should return null if role not existed', async () => {
      //arrange
      jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await rolesService.getRoleById(123);

      //assert
      expect(result).toEqual(null);
    });

    it('should return existed role', async () => {
      //arrange

      //act
      const result = await rolesService.getRoleById(salesRoleStub().id);

      //assert
      expect(result).toEqual(salesRoleStub());
    });
  });

  describe('updateRole', () => {
    it('should return null if role not existed', async () => {
      //arrange
      jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await rolesService.updateRole(1, updateSalesRoleDto);

      //assert
      expect(result).toEqual(null);
    });

    it('should throw error if has conflict role', async () => {
      //arrange
      jest
        .spyOn(mockRoleRepository, 'update')
        .mockRejectedValueOnce(new ConflictException());

      //act && arrange
      await expect(
        rolesService.updateRole(salesRoleStub().id, updateSalesRoleDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should update role and return it', async () => {
      //arrange
      jest
        .spyOn(mockRoleRepository, 'create')
        .mockResolvedValueOnce(afterUpdatedRoleStub());

      //act
      const result = await rolesService.updateRole(2, updateSalesRoleDto);

      //assert
      expect(result).toEqual(afterUpdatedRoleStub());
    });
  });

  describe('deleteRolePermanently', () => {
    it('should return null if role not existed', async () => {
      //arrange
      jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await rolesService.deleteRolePermanently(1);

      //assert
      expect(result).toEqual(null);
    });

    it('should delete permanently role and return it', async () => {
      //arrange

      //act
      const result = await rolesService.deleteRolePermanently(2);

      //assert
      expect(result).toEqual(salesRoleStub());
    });
  });

  describe('grantPermission', () => {
    it('should throw NotFoundException if role not existed', async () => {
      //arrange
      jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        rolesService.grantPermissions(salesRoleStub().id, [
          canReadCustomerPermissionStub().id,
          canCreateCustomerPermissionStub().id,
        ]),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if has permission not existed', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      //act && assert
      await expect(
        rolesService.grantPermissions(salesRoleStub().id, [
          canReadCustomerPermissionStub().id,
          canCreateCustomerPermissionStub().id,
        ]),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create new role_permission', async () => {
      //arrange

      //act
      const result = await rolesService.grantPermissions(salesRoleStub().id, [
        canReadCustomerPermissionStub().id,
        canCreateCustomerPermissionStub().id,
      ]);

      //assert
      expect(result).toEqual({ role_id: 2, permission_ids: [1, 2] });
    });
  });
});
