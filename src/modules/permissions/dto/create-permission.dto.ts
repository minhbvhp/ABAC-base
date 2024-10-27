import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ACTIONS } from '../../../utils/types/definitions';
import {
  ACTION_MUST_NOT_EMPTY,
  SUBJECT_ID_MUST_NUMBER,
  SUBJECT_MUST_NOT_EMPTY,
} from '../../../utils/constants/messageConstants';

export class CreatePermissionDto {
  @IsEnum(ACTIONS, {
    message: () => {
      return `${ACTION_MUST_NOT_EMPTY}. Quyền thao tác chỉ bao gồm: ${Object.values(ACTIONS).join(', ')}`;
    },
  })
  @IsNotEmpty({ message: ACTION_MUST_NOT_EMPTY })
  action: ACTIONS;

  @IsNumber({}, { message: SUBJECT_ID_MUST_NUMBER })
  @IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
  subjectId: number;

  @IsOptional()
  condition?: Record<string, any>;

  @IsBoolean({})
  @IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
  inverted: boolean;
}
