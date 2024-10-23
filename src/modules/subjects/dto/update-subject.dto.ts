import { IsEnum, IsNotEmpty } from 'class-validator';
import { SUBJECTS } from '../../../utils/types/definitions';
import { SUBJECT_MUST_NOT_EMPTY } from '../../../utils/constants/messageConstants';

export class UpdateSubjectDto {
  @IsEnum(SUBJECTS)
  @IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
  name: string;
}
