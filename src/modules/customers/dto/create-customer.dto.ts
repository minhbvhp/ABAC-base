import { IsNotEmpty, IsUUID } from 'class-validator';
import {
  ADDRESS_MUST_NOT_EMPTY,
  FULLNAME_MUST_NOT_EMPTY,
  TAXCODE_MUST_NOT_EMPTY,
} from '../../../utils/constants/messageConstants';

export class CreateCustomerDto {
  @IsNotEmpty({ message: TAXCODE_MUST_NOT_EMPTY })
  taxCode: string;

  @IsNotEmpty({ message: FULLNAME_MUST_NOT_EMPTY })
  fullName: string;

  @IsNotEmpty({ message: ADDRESS_MUST_NOT_EMPTY })
  address: string;
}
