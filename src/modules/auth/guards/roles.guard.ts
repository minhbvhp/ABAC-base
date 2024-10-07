import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from 'src/decorators/roles.decorator';
import { RequestWithUser } from '../../../utils/types/request.type';
import { NOT_AUTHORIZED } from 'src/utils/constants/messageConstants';
import { IS_PUBLIC_KEY } from 'src/decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles: string[] = this.reflector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const { user } = request;

    const isRoleIncluded = requiredRoles.some(
      (role) => role === user?.role?.name,
    );

    if (isRoleIncluded) return isRoleIncluded;

    throw new ForbiddenException(NOT_AUTHORIZED);
  }
}
