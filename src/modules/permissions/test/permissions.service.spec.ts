import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Permission from '../entities/permission.entity';
import { SubjectsService } from '../../subjects/subjects.service';
import {
  allPermissionsStub,
  canCreateCustomerPermissionStub,
  canReadCustomerPermissionStub,
  conflictPermissionStub,
} from './stubs/permission.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  createPermissionDto,
  updatePermissionDto,
} from './dto/mock-permission.dto';

jest.mock('../../subjects/subjects.service');

const mockPermissionRepository = {
  findOne: jest.fn().mockResolvedValue(canReadCustomerPermissionStub()),
  create: jest.fn().mockResolvedValue(canReadCustomerPermissionStub()),
  insert: jest.fn(),
  find: jest.fn().mockResolvedValue(allPermissionsStub()),
  update: jest.fn().mockResolvedValue(canCreateCustomerPermissionStub()),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

describe('PermissionsService', () => {
  let permissionsService: PermissionsService;
  let subjectsService: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        SubjectsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionsService>(PermissionsService);
    subjectsService = module.get<SubjectsService>(SubjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  describe('createPermission', () => {
    it('should throw NotFoundException if subject not existed', async () => {
      //arrange
      jest.spyOn(subjectsService, 'getSubjectById').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        permissionsService.createPermission(createPermissionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return null if permission existed', async () => {
      //arrange

      //act
      const result =
        await permissionsService.createPermission(createPermissionDto);

      //assert
      expect(result).toEqual(null);
    });

    it('should create permission and return it', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      //act
      const result =
        await permissionsService.createPermission(createPermissionDto);

      //assert
      expect(result).toEqual(canReadCustomerPermissionStub());
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      //arrange

      //act
      const result = await permissionsService.getAllPermissions();

      //assert
      expect(result).toEqual(allPermissionsStub());
    });
  });

  describe('getPermissionById', () => {
    it('should return null if permission not existed', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      //act
      const result = await permissionsService.getPermissionById(123);

      //assert
      expect(result).toEqual(null);
    });

    it('should return existed permission', async () => {
      //arrange

      //act
      const result = await permissionsService.getPermissionById(
        canReadCustomerPermissionStub().id,
      );

      //assert
      expect(result).toEqual(canReadCustomerPermissionStub());
    });
  });

  describe('updatePermission', () => {
    it('should throw NotFoundException if subject not existed', async () => {
      //arrange
      jest.spyOn(subjectsService, 'getSubjectById').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        permissionsService.updatePermission(1, updatePermissionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return null if permission not existed', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      //act
      const result = await permissionsService.updatePermission(
        1,
        updatePermissionDto,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should throw error if has conflict permission', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'update')
        .mockRejectedValueOnce(new ConflictException());

      //act && arrange
      await expect(
        permissionsService.updatePermission(
          canReadCustomerPermissionStub().id,
          updatePermissionDto,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should update permission and return it', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(canReadCustomerPermissionStub());

      jest
        .spyOn(mockPermissionRepository, 'create')
        .mockResolvedValueOnce(canCreateCustomerPermissionStub());

      //act
      const result = await permissionsService.updatePermission(
        1,
        updatePermissionDto,
      );

      //assert
      expect(result).toEqual(canCreateCustomerPermissionStub());
    });
  });

  describe('deletePermissionPermanently', () => {
    it('should return null if permission not existed', async () => {
      //arrange
      jest
        .spyOn(mockPermissionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      //act
      const result = await permissionsService.deletePermissionPermanently(1);

      //assert
      expect(result).toEqual(null);
    });

    it('should delete permanently permission and return it', async () => {
      //arrange

      //act
      const result = await permissionsService.deletePermissionPermanently(1);

      //assert
      expect(result).toEqual(canReadCustomerPermissionStub());
    });
  });
});
