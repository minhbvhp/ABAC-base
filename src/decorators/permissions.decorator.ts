import { CustomDecorator, SetMetadata } from '@nestjs/common';
import {
  PermissionAction,
  SubjectsType,
} from '../modules/casl/casl-ability.factory/casl-ability.factory';

export type RequiredPermission = [PermissionAction, SubjectsType];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
