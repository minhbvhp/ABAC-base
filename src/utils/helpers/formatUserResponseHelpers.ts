import User from 'src/modules/users/entities/user.entity';
import { UserResponseType } from '../types/definitions';
import { ServiceUnavailableException } from '@nestjs/common';

export const formatUserResponse = (user: User): UserResponseType => {
  try {
    if (user) {
      const { password, session, ...result } = user;
      return result;
    }

    return null;
  } catch (error) {
    throw new ServiceUnavailableException(
      'Lỗi dịch vụ',
      'User service error - format user response',
    );
  }
};
