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

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly refector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.refector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const { user } = request;

    const isRoleIncluded = requiredRoles.some(
      (role) => role === user?.role.name,
    );

    if (isRoleIncluded) return isRoleIncluded;

    throw new ForbiddenException(NOT_AUTHORIZED);
  }
}
