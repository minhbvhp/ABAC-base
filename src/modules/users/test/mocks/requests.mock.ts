import { RequestWithUser } from '../../../../utils/types/request.type';
import { createUserStub } from '../stubs/user.stub';

export const mockRequestWithUser = {
  user: createUserStub(),
} as RequestWithUser;

export const mockRequest = {
  body: {},
  query: {},
} as unknown as Request;
