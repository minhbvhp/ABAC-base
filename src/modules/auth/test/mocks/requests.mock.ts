import { RequestWithUser } from '../../../../utils/types/request.type';
import { createUserStub } from '../../../users/test/stubs/user.stub';

export const mockRequestWithUser = {
  user: createUserStub(),
} as RequestWithUser;
