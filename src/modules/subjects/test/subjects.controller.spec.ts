import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsController } from '../subjects.controller';
import { SubjectsService } from '../subjects.service';
import { SUBJECTS } from '../../../utils/types/definitions';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  allSubjectsStub,
  customerSubjectStub,
  updatedCustomerSubjectStub,
} from './stubs/subject.stub';
import { isGuarded } from '../../../shared/test/utils';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../../auth/guards/jwt-access-token.guard';

jest.mock('../subjects.service');

const createSubjectDto = {
  name: SUBJECTS.CUSTOMER,
} as CreateSubjectDto;

const updateSubjectDto = {
  name: SUBJECTS.USER,
} as UpdateSubjectDto;

describe('SubjectsController', () => {
  let subjectsController: SubjectsController;
  let subjectsService: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [SubjectsService],
    }).compile();

    subjectsController = module.get<SubjectsController>(SubjectsController);
    subjectsService = module.get<SubjectsService>(SubjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(subjectsController).toBeDefined();
  });

  it('should be protected with RolesGuard', () => {
    expect(isGuarded(SubjectsController, RolesGuard));
  });

  it('should be protected with JwtAccessTokenGuard', () => {
    expect(isGuarded(SubjectsController, JwtAccessTokenGuard));
  });

  describe('createSubject', () => {
    it('should throw ConflictException if subject service return null', async () => {
      //arrange
      jest.spyOn(subjectsService, 'createSubject').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        subjectsController.createSubject(createSubjectDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new subject and return response', async () => {
      //arrange

      //act
      const response = await subjectsController.createSubject(createSubjectDto);

      //expect
      expect(response).toEqual({
        message: 'Đã tạo đối tượng mới',
        result: { subject_name: customerSubjectStub().name },
      });
    });
  });

  describe('getAllSubjects', () => {
    it('should return response subjects', async () => {
      //arrange

      //act
      const response = await subjectsController.getAllSubjects();

      //expect
      expect(response).toEqual({
        message: 'Tìm tất cả đối tượng',
        result: allSubjectsStub(),
      });
    });
  });

  describe('updateSubject', () => {
    it('should throw NotFoundException if subject service return null', async () => {
      //arrange
      jest.spyOn(subjectsService, 'updateSubject').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        subjectsController.updateSubject('id', updateSubjectDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update subject and return response', async () => {
      //arrange

      //act
      const response = await subjectsController.updateSubject(
        customerSubjectStub().id.toString(),
        updateSubjectDto,
      );

      //act && assert
      expect(subjectsService.updateSubject).toHaveBeenCalledWith(
        customerSubjectStub().id,
        updateSubjectDto,
      );

      expect(response).toStrictEqual({
        message: 'Đã cập nhật thông tin đối tượng',
        result: updatedCustomerSubjectStub(),
      });
    });
  });

  describe('deleteSubjectPermanently', () => {
    it('should throw NotFoundException if subject service return null', async () => {
      //arrange
      jest
        .spyOn(subjectsService, 'deleteSubjectPermanently')
        .mockResolvedValueOnce(null);

      //act && assert
      await expect(
        subjectsController.deleteSubjectPermanently('id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete subject and return response', async () => {
      //arrange

      //act
      const response = await subjectsController.deleteSubjectPermanently(
        customerSubjectStub().id.toString(),
      );

      //act && assert
      expect(subjectsService.deleteSubjectPermanently).toHaveBeenCalledWith(
        customerSubjectStub().id,
      );

      expect(response).toStrictEqual({
        message: 'Đã xóa đối tượng',
        result: customerSubjectStub(),
      });
    });
  });
});
