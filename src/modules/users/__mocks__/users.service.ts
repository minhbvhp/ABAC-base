import { allUserStub, createUserStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUserbyEmail: jest.fn().mockResolvedValue(createUserStub()),
  createUser: jest.fn().mockResolvedValue({ userId: createUserStub().id }),
  getAllUsers: jest.fn().mockResolvedValue(allUserStub().slice(20, 30)),
  updateUser: jest.fn().mockResolvedValue(createUserStub()),
  deleteUserPermanently: jest.fn().mockResolvedValue(createUserStub()),
});
