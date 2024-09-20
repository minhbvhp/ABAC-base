import { createUserStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(createUserStub()),
  create: jest.fn().mockResolvedValue(createUserStub()),
  insert: jest.fn().mockResolvedValue(createUserStub()),
  findAll: jest.fn().mockResolvedValue([createUserStub()]),
  update: jest.fn().mockResolvedValue(createUserStub()),
  remove: jest.fn().mockResolvedValue(createUserStub()),
});
