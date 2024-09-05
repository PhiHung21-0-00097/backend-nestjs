import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from 'src/modules/roles/roles.controller';
import { RoleService } from 'src/modules/roles/roles.service';
import { Role, RoleSchema } from 'src/modules/roles/schemas/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
