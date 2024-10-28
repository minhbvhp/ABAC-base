import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from '../subjects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Subject from '../entities/subject.entity';
import {
  allSubjectsStub,
  conflictSubjectStub,
  customerSubjectStub,
  updatedCustomerSubjectStub,
  userSubjectStub,
} from './stubs/subject.stub';
import { SUBJECTS } from '../../../utils/types/definitions';
import { ConflictException } from '@nestjs/common';

const mockSubjectRepository = {
  findOne: jest.fn().mockResolvedValue(customerSubjectStub()),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn().mockResolvedValue(allSubjectsStub()),
  update: jest.fn().mockResolvedValue(updatedCustomerSubjectStub()),
  remove: jest.fn().mockResolvedValue(customerSubjectStub()),
  findAndCount: jest.fn(),
};

describe('SubjectsService', () => {
  let subjectsService: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectsService,
        {
          provide: getRepositoryToken(Subject),
          useValue: mockSubjectRepository,
        },
      ],
    }).compile();

    subjectsService = module.get<SubjectsService>(SubjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(subjectsService).toBeDefined();
  });

  describe('createSubject', () => {
    it('should return null if subject existed', async () => {
      //arrange

      //act
      const result = await subjectsService.createSubject({
        name: SUBJECTS.CUSTOMER,
      });

      //assert
      expect(result).toEqual(null);
    });

    it('should create new subject and return its data', async () => {
      //arrange
      jest
        .spyOn(mockSubjectRepository, 'create')
        .mockReturnValueOnce(userSubjectStub());

      jest.spyOn(mockSubjectRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await subjectsService.createSubject({
        name: SUBJECTS.USER,
      });

      //assert
      expect(result).toEqual({ subject_name: userSubjectStub().name });
    });
  });

  describe('getAllSubjects', () => {
    it('should return all subjects', async () => {
      //arrange

      //act
      const result = await subjectsService.getAllSubjects();

      //assert
      expect(result).toEqual(allSubjectsStub());
    });
  });

  describe('getSubjectById', () => {
    it('should return null if subject not existed', async () => {
      //arrange
      jest.spyOn(mockSubjectRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await subjectsService.getSubjectById(
        customerSubjectStub().id,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should return subject if subject existed', async () => {
      //arrange

      //act
      const result = await subjectsService.getSubjectById(
        customerSubjectStub().id,
      );

      //assert
      expect(result).toEqual(customerSubjectStub());
    });
  });

  describe('getSubjectByName', () => {
    it('should return null if subject not existed', async () => {
      //arrange
      jest.spyOn(mockSubjectRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await subjectsService.getSubjectByName(
        customerSubjectStub().name,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should return subject if subject existed', async () => {
      //arrange

      //act
      const result = await subjectsService.getSubjectByName(
        customerSubjectStub().name,
      );

      //assert
      expect(result).toEqual(customerSubjectStub());
    });
  });

  describe('updateSubject', () => {
    it('should return null if subject not existed', async () => {
      //arrange
      jest.spyOn(mockSubjectRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await subjectsService.updateSubject(
        customerSubjectStub().id,
        { name: SUBJECTS.USER },
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should throw error if has conflict subject', async () => {
      //arrange
      jest
        .spyOn(mockSubjectRepository, 'update')
        .mockRejectedValueOnce(new ConflictException());

      //act && arrange
      await expect(
        subjectsService.updateSubject(customerSubjectStub().id, {
          name: SUBJECTS.USER,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should return updated subject if subject existed', async () => {
      //arrange
      jest
        .spyOn(mockSubjectRepository, 'findOne')
        .mockResolvedValueOnce(customerSubjectStub());

      jest
        .spyOn(mockSubjectRepository, 'create')
        .mockResolvedValueOnce(updatedCustomerSubjectStub());

      //act
      const result = await subjectsService.updateSubject(
        customerSubjectStub().id,
        { name: SUBJECTS.USER },
      );

      //assert
      expect(result).toEqual(updatedCustomerSubjectStub());
    });
  });

  describe('deleteSubjectPermanently', () => {
    it('should return null if subject not existed', async () => {
      //arrange
      jest.spyOn(mockSubjectRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await subjectsService.deleteSubjectPermanently(
        customerSubjectStub().id,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should return subject if subject existed', async () => {
      //arrange

      //act
      const result = await subjectsService.deleteSubjectPermanently(
        customerSubjectStub().id,
      );

      //assert
      expect(result).toEqual(customerSubjectStub());
    });
  });
});
