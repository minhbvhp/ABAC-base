import { ACTIONS } from '../../../../utils/types/definitions';
import { customerSubjectStub } from '../../../subjects/test/stubs/subject.stub';
import Permission from '../../entities/permission.entity';

export const canReadCustomerPermissionStub = (): Permission =>
  ({
    id: 1,
    action: ACTIONS.READ,
    subject: customerSubjectStub(),
    condition: { userId: '${id}' },
  }) as unknown as Permission;

export const conflictPermissionStub = (): Permission =>
  ({
    id: 1,
    action: ACTIONS.READ,
    subject: customerSubjectStub(),
    condition: { zone: '${id}' },
  }) as unknown as Permission;

export const canCreateCustomerPermissionStub = (): Permission =>
  ({
    id: 1,
    action: ACTIONS.CREATE,
    subject: customerSubjectStub(),
    condition: { userId: '${id}' },
  }) as unknown as Permission;

export const allPermissionStub = (): Permission[] => [
  canReadCustomerPermissionStub(),
  canCreateCustomerPermissionStub(),
];
