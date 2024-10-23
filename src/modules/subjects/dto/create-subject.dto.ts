import { IsEnum, IsNotEmpty, ValidationArguments } from 'class-validator';
import { SUBJECTS } from '../../../utils/types/definitions';
import { SUBJECT_MUST_NOT_EMPTY } from '../../../utils/constants/messageConstants';

export class CreateSubjectDto {
  @IsEnum(SUBJECTS, {
    message: () => {
      return `${SUBJECT_MUST_NOT_EMPTY}. Đối tượng chỉ bao gồm: ${Object.values(SUBJECTS).join(', ')}`;
    },
  })
  @IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
  name: SUBJECTS;
}
