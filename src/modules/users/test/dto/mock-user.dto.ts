import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

export const createUserDto = {
  email: 'Test1@gmail.com',
  password: 'Test1@gmail.com',
  name: 'Test1@gmail.com',
  genderId: 1,
  phoneNumber: '0123456789',
  address: '24 Điện Biên Phủ',
  roleId: 2,
  companyId: 2,
} as CreateUserDto;

export const updateUserDto = {
  name: 'TestUpdate',
  genderId: 2,
  phoneNumber: '55555',
  address: 'Update address',
  roleId: 3,
  companyId: 1,
} as UpdateUserDto;
