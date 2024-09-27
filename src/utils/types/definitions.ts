import User from 'src/modules/users/entities/user.entity';

export type CustomResponseType = {
  message: string;
  result: any;
};

export type UserResponseType = Omit<User, 'password' | 'session'>;
