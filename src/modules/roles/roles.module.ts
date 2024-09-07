import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from 'src/modules/permission/permission.entity';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { Role, RoleSchema } from 'src/modules/roles/role.entity';
import { RoleController } from 'src/modules/roles/roles.controller';
import { RoleService } from 'src/modules/roles/roles.service';
import { UserModule } from 'src/modules/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
