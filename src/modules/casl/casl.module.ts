import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { UsersModule } from '../users/users.module';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UsersService } from '../users/users.service';

const existedUsersService = {
  provide: 'existedUsersService',
  useExisting: UsersService,
};

@Global()
@Module({
  providers: [CaslAbilityFactory, PermissionsGuard, existedUsersService],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
