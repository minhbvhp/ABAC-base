import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { UsersModule } from '../users/users.module';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Global()
@Module({
  imports: [UsersModule],
  providers: [CaslAbilityFactory, PermissionsGuard],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
