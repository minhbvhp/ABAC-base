import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Permission from '../entities/permission.entity';
import { SubjectsService } from '../../subjects/subjects.service';
import { canReadCustomerStub } from './stubs/permission.stub';

jest.mock('../../subjects/subjects.service');

const mockPermissionRepository = {
  findOne: jest.fn().mockResolvedValue(canReadCustomerStub()),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
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

  it('should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  describe('createPermission', () => {
    it('should throw NotFoundException if subject not existed', async () => {});
  });
});
