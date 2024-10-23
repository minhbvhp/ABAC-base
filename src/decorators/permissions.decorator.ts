import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ACTIONS, SUBJECTS } from '../utils/types/definitions';

export type RequiredPermission = [ACTIONS, SUBJECTS];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
