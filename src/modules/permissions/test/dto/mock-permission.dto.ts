import { ACTIONS } from '../../../../utils/types/definitions';
import { CreatePermissionDto } from '../../dto/create-permission.dto';

export const createPermissionDto: CreatePermissionDto = {
  action: ACTIONS.READ,
  subjectId: 1,
  condition: { userId: '${id}' },
  inverted: true,
};

export const updatePermissionDto: CreatePermissionDto = {
  action: ACTIONS.CREATE,
  subjectId: 1,
  condition: { userId: '${id}' },
  inverted: true,
};
