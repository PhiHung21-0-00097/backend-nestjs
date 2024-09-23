import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserService } from 'src/modules/users/user.service';
import { UpdateUserDto } from 'src/modules/users/dto/update-user';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserDocument } from 'src/modules/users/user.entity';
import { Authentication } from 'src/decorators/authentication.decorator';
import { Authorization } from 'src/decorators/authorization.decorator';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { UpdatePasswordDto } from 'src/modules/users/dto/update-passowrd.dto';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Request } from 'express';
import { Logging } from 'src/decorators/logging.decorator';
import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { GetPagination } from 'src/interfaces/get-paging.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Post()
  // @Authorization(SubjectEnum.USER, ActionEnum.CREATE)
  @ResponseMessage('Create a new user')
  createNewUser(
    @Body() createUser: CreateUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.userServices.create(createUser, request, userIp, user);
  }

  @Get()
  @ResponseMessage('Get All a user by id')
  getAllUser() {
    return this.userServices.getAllUser();
  }

  // @Authorization(SubjectEnum.USER, ActionEnum.READ)
  @Get('pagination')
  getPaginationUser(
    @Query() query: GetPagination,
    @AuthUser() user: UserDocument,
  ) {
    return this.userServices.getPaginationUser(query, user);
  }

  @Get(':id')
  @ResponseMessage('Fetch a user by id')
  getUserById(@Param('id') id: string) {
    return this.userServices.getUserById(id);
  }

  @Put('password/:id')
  @Logging(
    'Người dùng đổi mật khẩu',
    ActionLogEnum.CHANGE_PASSWORD,
    SubjectEnum.USER,
  )
  updatePassword(
    @Param('id') id: string,
    @Body()
    udPassowrd: UpdatePasswordDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.userServices.updatePassword(id, udPassowrd, user);
  }

  @Put(':id')
  @ResponseMessage('Update a user by id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.userServices.updateUserById(
      id,
      updateUser,
      request,
      userIp,
      user,
    );
  }

  @Delete(':id')
  @ResponseMessage('Delete a user by id')
  deleteById(@Param('id') id: string) {
    return this.userServices.deleteById(id);
  }

  // GET-ID
  // @Get('pipe/:id')
  // getUserByIdPipe(@Param('id', ParseIntPipe) id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
  // }
  // @Get('param/:id')
  // getUserByIdParam(@Param('id') id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
  // }
  // @Get('param/:id')
  // getUserByIdValidatiton(@Param('id') id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
}
