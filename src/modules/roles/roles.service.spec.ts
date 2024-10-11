import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Role from './entities/role.entity';

const mockRoleRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
