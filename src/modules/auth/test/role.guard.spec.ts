import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { executionContext } from '../../../shared/test/mocks/execution-context.mock';
import { mockRequestWithUser } from './mocks/requests.mock';
import { ROLES } from '../../../decorators/roles.decorator';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if the user has a required role', () => {
    //arrange
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Admin']);

    (
      executionContext.switchToHttp().getRequest as jest.Mock
    ).mockReturnValueOnce(mockRequestWithUser);

    //act && assert
    expect(rolesGuard.canActivate(executionContext)).toBeTruthy();

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES, [
      executionContext.getHandler(),
      executionContext.getClass(),
    ]);
  });

  // it('should call super.canActivate() when isPublic is false', () => {
  //   //arrange
  //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

  //   jest
  //     .spyOn(AuthGuard('jwt').prototype, 'canActivate')
  //     .mockReturnValueOnce(true);

  //   //act && assert
  //   expect(guard.canActivate(executionContext)).toBeTruthy();

  //   expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
  //     executionContext.getHandler(),
  //     executionContext.getClass(),
  //   ]);

  //   expect(AuthGuard('jwt').prototype.canActivate).toHaveBeenCalledTimes(1);
  // });
});
