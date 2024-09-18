import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { Role, RoleSchema } from 'src/modules/roles/role.entity';
import { Test } from 'src/modules/test/test.entity';
import { TestModule } from 'src/modules/test/test.module';
import { RoleModule } from 'src/modules/roles/roles.module';
import { UserController } from 'src/modules/users/user.controller';
import { User, UserSchema } from 'src/modules/users/user.entity';
import { UserService } from 'src/modules/users/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    PermissionModule,
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
