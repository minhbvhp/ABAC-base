import User from 'src/modules/users/entities/user.entity';

export const createUserStub = (): User => {
  return {
    id: 'ABCD123456',
    email: 'Test1@gmail.com',
    password: 'strongP@ssword',
    name: 'Test1@gmail.com',
    genderId: 1,
    phoneNumber: '0123456789',
    address: 'mock address',
    roleId: 1,
    companyId: 2,
    createdAt: new Date(),
    session: null,
  };
};
