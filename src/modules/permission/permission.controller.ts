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
// import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permisstion.dto';
import { UpdatePermisstionDto } from './dto/update-permisstion.dto';
import { Authorization } from 'src/decorators/authorization.decorator';
import { CreatePermissionRoleDto } from './dto/create-permission-role.dto';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';
import { ObjectIdValidationPipe } from 'src/pipes/isValidObjectId.pipe';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { Logging } from 'src/decorators/logging.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { Request } from 'express';
import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { UserDocument } from 'src/modules/users/user.entity';

@Controller('permissions')
export class PermissionController {
//   constructor(private readonly permissionService: PermissionService) {}
//   @Authorization(SubjectEnum.ROLE, ActionEnum.CREATE)
//   @Logging('Tạo mới role và quyền hạn', ActionLogEnum.CREATE, SubjectEnum.ROLE)
//   @Post('/create-permission-role')
//   async createPermissionRole(
//     @Body() permission: CreatePermissionRoleDto,
//     @AuthUser() user: UserDocument,
//     @Req() request: Request,
//     @GetClientIP() userIp: string,
//   ) {
//     return this.permissionService.createPermissionRole(
//       permission,
//       user,
//       request,
//       userIp,
//     );
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.CREATE)
//   @Logging('Tạo mới quyền hạn', ActionLogEnum.CREATE, SubjectEnum.ROLE)
//   @Post('/')
//   async create(
//     @Body() permission: CreatePermissionDto,
//     @AuthUser() user: UserDocument,
//     @Req() request: Request,
//     @GetClientIP() userIp: string,
//   ) {
//     return this.permissionService.createPermission(
//       permission,
//       user,
//       request,
//       userIp,
//     );
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.DELETE)
//   @Logging(
//     'Xóa quyền hạn có id: /id/',
//     ActionLogEnum.DELETE,
//     SubjectEnum.ROLE,
//     ['id'],
//   )
//   @Delete('/:id')
//   async delete(
//     @Param('id', ObjectIdValidationPipe) id: string,
//     @AuthUser() user: UserDocument,
//     @Req() request: Request,
//     @GetClientIP() userIp: string,
//   ) {
//     return this.permissionService.delete(id, user, request, userIp);
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
//   @Logging(
//     'Cập nhật role và quyền hạn có id : /id/',
//     ActionLogEnum.UPDATE,
//     SubjectEnum.ROLE,
//     ['id'],
//   )
//   @Put('update-permission-by-role-id/:id')
//   async UpdatePermissionByRoleId(
//     @Body() permission: UpdatePermissionRoleDto,
//     @Param('id', ObjectIdValidationPipe) id: string,
//     @AuthUser() user: UserDocument,
//     @Req() request: Request,
//     @GetClientIP() userIp: string,
//   ) {
//     return this.permissionService.updatePermissionByRoleId(
//       id,
//       permission,
//       user,
//       request,
//       userIp,
//     );
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
//   @Logging(
//     'Cập nhật quyền hạn có id : /id/',
//     ActionLogEnum.UPDATE,
//     SubjectEnum.ROLE,
//     ['id'],
//   )
//   @Put('/:id')
//   async update(
//     @Body() permission: UpdatePermisstionDto,
//     @Param('id') id: string,
//     @AuthUser() user: UserDocument,
//     @Req() request: Request,
//     @GetClientIP() userIp: string,
//   ) {
//     return this.permissionService.updateById(
//       id,
//       permission,
//       user,
//       request,
//       userIp,
//     );
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
//   @Get('get-all')
//   async GetAll() {
//     return this.permissionService.GetAll();
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
//   @Get('get-all-by-role-id/:id')
//   async GetAllByRoleId(@Param('id') id: string) {
//     return this.permissionService.getAllByRoleId(id);
//   }
//   @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
//   @Get('/:id')
//   async getById(@Param('id') id: string) {
//     return this.permissionService.getById(id);
//   }
}
