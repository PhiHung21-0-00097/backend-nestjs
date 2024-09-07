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
import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Authorization } from 'src/decorators/authorization.decorator';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { Logging } from 'src/decorators/logging.decorator';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/modules/roles/dto/update-role.dto';
import { RoleService } from 'src/modules/roles/roles.service';
import { UserDocument } from 'src/modules/users/user.entity';
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

  @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
  @Logging(
    'Cập nhật role có id: /id/',
    ActionLogEnum.UPDATE,
    SubjectEnum.ROLE,
    ['id'],
  )
  @Put('/:id')
  async update(
    @Body() role: UpdateRoleDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.update(role, id, request, userIp, user);
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
  delete(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.delete(id, request, userIp, user);
  }
}
