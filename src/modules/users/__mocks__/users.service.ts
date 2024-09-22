import { allUserStub, createUserStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(createUserStub()),
  create: jest.fn().mockResolvedValue(createUserStub()),
  insert: jest.fn().mockResolvedValue(createUserStub()),
  findAll: jest.fn().mockResolvedValue(allUserStub().slice(20, 30)),
  update: jest.fn().mockResolvedValue(createUserStub()),
  remove: jest.fn().mockResolvedValue(createUserStub()),
});
