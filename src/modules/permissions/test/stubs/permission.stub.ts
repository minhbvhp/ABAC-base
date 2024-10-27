import { ACTIONS } from '../../../../utils/types/definitions';
import { customerSubjectStub } from '../../../subjects/test/stubs/subject.stub';
import Permission from '../../entities/permission.entity';

export const canReadCustomerStub = (): Permission =>
  ({
    id: 1,
    action: ACTIONS.READ,
    subject: customerSubjectStub(),
    condition: { userId: '${id}' },
  }) as unknown as Permission;

export const canCreateCustomerStub = (): Permission =>
  ({
    id: 1,
    action: ACTIONS.CREATE,
    subject: customerSubjectStub(),
    condition: { userId: '${id}' },
  }) as unknown as Permission;
