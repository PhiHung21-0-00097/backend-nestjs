import { Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleModule } from 'src/modules/roles/roles.module';
import { RoleService } from 'src/modules/roles/roles.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('test')
  createRole() {
    return this.roleService.createRole();
  }
}
