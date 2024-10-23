import { IsNotEmpty, IsOptional } from 'class-validator';
import { ROLE_MUST_NOT_EMPTY } from '../../../utils/constants/messageConstants';
import { ROLES } from '../../../utils/types/definitions';

export class CreateRoleDto {
  @IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
  name: ROLES;

  @IsOptional()
  description: string;
}
