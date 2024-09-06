import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ResponseMessage } from 'src/auth/decorators/response_message.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import { RoleService } from 'src/modules/roles/roles.service';
import { UserDocument } from 'src/modules/users/user.entity';
import { IUser } from 'src/modules/users/users.interface';
import { ObjectIdValidationPipe } from 'src/pipes/isValidObjectId.pipe';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/get-all')
  getAllRole() {
    return this.roleService.getAllRole();
  }

  @Get('/:id')
  getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.roleService.getById(id);
  }

  @Put('/:id')
  update() {
    console.log('Thành công');
    return 'Thành công';
  }

  @Post()
  @ResponseMessage('Create a new role')
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.create(createRoleDto, request, userIp, user);
  }

  @Delete('/:id')
  delete() {
    console.log('Thành công');
    return 'Thành công';
  }
}
