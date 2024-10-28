import { SUBJECTS } from '../../../../utils/types/definitions';
import Subject from '../../entities/subject.entity';

export const customerSubjectStub = (): Subject =>
  ({
    id: 1,
    name: SUBJECTS.CUSTOMER,
  }) as unknown as Subject;

export const conflictSubjectStub = (): Subject =>
  ({
    id: 1,
    name: SUBJECTS.USER,
  }) as unknown as Subject;

export const updatedCustomerSubjectStub = (): Subject =>
  ({
    id: 1,
    name: SUBJECTS.USER,
  }) as unknown as Subject;

export const userSubjectStub = (): Subject =>
  ({
    id: 2,
    name: SUBJECTS.USER,
  }) as unknown as Subject;

export const allSubjectsStub = (): Subject[] => [
  customerSubjectStub(),
  userSubjectStub(),
];
