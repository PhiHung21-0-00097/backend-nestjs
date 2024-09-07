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
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserService } from 'src/modules/users/user.service';
import { ResponseMessage } from 'src/auth/decorators/response_message.decorator';
import { UpdateUserDto } from 'src/modules/users/dto/update-user';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserDocument } from 'src/modules/users/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Post()
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
  finAll() {
    return this.userServices.findAll();
  }

  @Get(':id')
  @ResponseMessage('Fetch a user by id')
  getUserById(@Param('id') id: string) {
    console.log(id);
    return this.userServices.getUserById(id);
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
  remove(@Param('id') id: string) {
    return this.userServices.remove(id);
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
