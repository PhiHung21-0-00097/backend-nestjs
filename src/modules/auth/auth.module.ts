import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from 'src/modules/users/user.module';
import { RoleModule } from 'src/modules/roles/roles.module';
@Module({
  imports: [UserModule, RoleModule, PermissionModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
